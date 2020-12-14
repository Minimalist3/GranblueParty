#!/usr/bin/python3

import datetime
import functools
import html
from html.parser import HTMLParser
import getopt
import json
import math
import os
import re
import sys
import time
import requests

import mwparserfromhell

from config import defines
import database

# Parse description tooltips
class TooltipParser(HTMLParser):
  def __init__(self):
    self.text = ''
    self.parens = []
    self.ignoreTag = False
    super().__init__()

  def handle_starttag(self, tag, attrs):
    if tag.lower() == "ref":
      self.ignoreTag = True

    newLevel = False
    for attr in attrs:
      if attr[1] != None and attr[1].lower() == 'tooltiptext':
        #self.text += ' ('
        self.parens.append(1)
        newLevel = True
    
    if newLevel == False:
      parensCount = len(self.parens)
      if parensCount > 0:
        self.parens[parensCount-1] += 1
    
    #print('START', tag, attrs, self.parens)

  def handle_endtag(self, tag):
    #print('END', tag, self.parens)
    if tag.lower() == "ref":
      self.ignoreTag = False

    parensCount = len(self.parens)
    if parensCount > 0:
      self.parens[parensCount-1] -= 1
      if self.parens[parensCount-1] < 1:
        self.parens.pop()
        #self.text += ')'      

  def handle_data(self, data):
    if self.ignoreTag:
      return
    if len(self.parens) > 0:
      return
    if len(self.text) > 0 and not self.text.endswith((' ', '(')):
      self.text += ' '
    #print(data, self.parens)
    self.text += data


unique_ref_regex = re.compile('\'\"`.*`\"\'')
multiple_spaces_regex = re.compile('[ ]+')
html_attr1_regex = re.compile('(<[^/][^>]*?=\"[a-zA-Z ]*?)([ ]*?[/]??>)')
html_attr2_regex = re.compile('([a-zA-Z0-9])/>')
def parseDescription(text):
  if text == None:
    return text

  #print(text)
  skill_desc = html_attr1_regex.sub(r'\g<1>" \g<2>', text)
  #print(skill_desc)
  skill_desc = html_attr2_regex.sub(r'\g<1> />', skill_desc)
  #print(skill_desc)
  skill_desc = html.unescape(skill_desc).replace('&nbsp;', ' ').replace('\u007f', '')
  parser = TooltipParser()
  parser.feed(skill_desc)
  skill_desc = mwparserfromhell.parse(parser.text)

  # For character skills
  for item in reversed(skill_desc.filter_templates()):
    new_value = ''
    if item.has('des'):
      new_value += str(item.get('des').value)
    if item.has('des1'):
      des = str(item.get('des1').value)
      if len(des) > 0:
        if item.has('level1'):
          new_value += ' At level ' + str(item.get('level1').value) + ": "
        new_value += des
    if item.has('des2'):
      des = str(item.get('des2').value)
      if len(des) > 0:
        if item.has('level2'):
          new_value += ' At level ' + str(item.get('level2').value) + ": "
        new_value += des
    if item.has('des3'):
      des = str(item.get('des3').value)
      if len(des) > 0:
        if item.has('level3'):
          new_value += ' At level ' + str(item.get('level3').value) + ": "
        new_value += des

    item_name_lower = item.name.lower()
    if len(new_value) > 0:
      skill_desc.replace(item, new_value)
    elif item_name_lower in ['status', 'tt', 'verify']:
      skill_desc.replace(item, item.params[0].value)
    elif item_name_lower == 'infoskillupgrade':
      if item.has('text'):
        skill_desc.replace(item, item.params[0].value)
      elif item.has('uncap'):
        skill_desc.replace(item, 'After ' + str(item.params[0].value) + '★:')

  # For weapons
  for item in skill_desc.filter():
    if isinstance(item, mwparserfromhell.nodes.wikilink.Wikilink):
      item_title_lower = item.title.lower()
      if item_title_lower.startswith('file:'):
        skill_desc.remove(item)
      elif item_title_lower.startswith('category:'):
        skill_desc.remove(item)
      elif item.text != None:
        skill_desc.replace(item, item.text)
      else:
        skill_desc.replace(item, item.title)

  # More cleanup
  skill_desc = str(skill_desc)
  skill_desc = unique_ref_regex.sub('', skill_desc)
  skill_desc = skill_desc.replace('\'\'\'', '\'')
  skill_desc = skill_desc.replace(') ,', '),')
  skill_desc = skill_desc.replace('\n', '')
  skill_desc = multiple_spaces_regex.sub(' ', skill_desc)
  return skill_desc


FRONTEND_DIR = defines.getConfig('config/config.ini', 'path')['frontend']
addToDB = True
verbose = False
# https://gbf.wiki/Special:CargoTables
TABLES = {
  'characters': 'id,name,jpname,release_date,obtain_text,base_evo,max_evo,rarity,element,type,race,weapon',
  'summons': 'id,name,jpname,release_date,obtain,evo_base,evo_max,rarity,element',
  'weapons': 'id,name,jpname,evo_base,evo_max,rarity,element,type,ca1_desc,ca2_desc,ca3_desc,s1_name,s1_icon,s1_lvl,s1_desc,s1u1_name,s1u1_icon,s1u1_lvl,s1u1_desc,s2_name,s2_icon,s2_lvl,s2_desc,s2u1_name,s2u1_icon,s2u1_lvl,s2u1_desc,s3_name,s3_icon,s3_lvl,s3_desc,s3u1_name,s3u1_icon,s3u1_lvl,s3u1_desc,atk1,atk2,atk3,atk4,hp1,hp2,hp3,hp4',
  'class_skill': 'class,name,ix,family,row,ex,icon'
}
session = requests.Session()

def sessionGet(url, params = {}):
  request = session.get(url = url, params = params)

  if request.status_code != 200:
    print('Got status code', request.status_code, 'for', url)
  
  return request


def downloadCargo(path, table, where = '', order_by = 'id', unique_ident = ['id']):
  results = []
  ids = set()
  offset = 0
  limit = 500
  while True:
    request = sessionGet(
      url = 'https://gbf.wiki/api.php',
      params = {
        'action': 'cargoquery',
        'tables': table,
        'fields': TABLES[table],
        'format': 'json',
        'order_by': order_by,
        'limit': limit,
        'offset': offset,
        'where': where
      })

    request_json = request.json()

    if 'warnings' in request_json:
      print(request_json['warnings'])
      sys.exit(1)
    elif 'error' in request_json:
      print(request_json['error'])
      sys.exit(1)
    
    offset += limit
    # Remove the 'title' part
    for res in request_json['cargoquery']:
      # Filter duped ids
      unique = ''
      for u in unique_ident:
        unique += res['title'][u]

      if not unique in ids:
        results += [res['title']]
        ids.add(unique)
    
    if len(request_json['cargoquery']) != limit:
      break

  with open(os.path.join(path, table + '.json'), 'w') as fd:
    json.dump(results, fd, indent=2)


def downloadCategory(path, category):
  results = []
  limit = 500
  cmcontinue = ''

  while True:
    request = sessionGet(
      url = 'https://gbf.wiki/api.php',
      params = {
        'action': 'query',
        'prop': 'info',
        'generator': 'categorymembers',
        'gcmtitle': 'Category:' + category,
        'format': 'json',
        'gcmlimit': limit,
        'gcmcontinue': cmcontinue
      })
    
    request_json = request.json()

    if 'warnings' in request_json:
      print(request_json['warnings'])
      sys.exit(1)
    elif 'error' in request_json:
      print(request_json['error'])
      sys.exit(1)

    # Remove the 'title' part
    for res in request_json['query']['pages']:
      res_values = { your_key: request_json['query']['pages'][res][your_key] for your_key in ['pageid', 'title', 'lastrevid'] }
      results += [res_values]

    if 'continue' in request_json:
      cmcontinue = request_json['continue']['gcmcontinue']      
    else:
      break

  with open(os.path.join(path, category + '_category.json'), 'w') as fd:
    json.dump(results, fd, indent=2)


def updateCache(category):
  cache_dir = os.path.join(os.getcwd(), 'data', 'cache')

  with open(os.path.join('data', category + '_category.json'), 'r', encoding='utf8') as fd, open(os.path.join('data', 'cache_revisions.json'), 'r+', encoding='utf8') as fd_revs:
    data = json.load(fd)
    data_revs = json.load(fd_revs)

    for unit in data:
      page_id = str(unit['pageid'])
      page_name = os.path.join(cache_dir, page_id + '.page')
      page_title = unit['title']

      if page_title.endswith(' List') or page_title.startswith('Category:'):
        continue

      if not os.path.isfile(page_name) or not page_id in data_revs or data_revs[page_id] != unit['lastrevid']:
        print("Downloading ", page_title, ' [' + page_id + ']')
        time.sleep(.1) # Don't hammer the server
        request = sessionGet(
          url = 'https://gbf.wiki/api.php',
          params = {
            'action': 'query',
            'prop': 'revisions',
            'rvprop': 'content',
            'format': 'json',
            'pageids': unit['pageid']
          })
        
        request_json = request.json()['query']['pages'][page_id]['revisions'][0]['*']
        with open(page_name, 'w', encoding='utf8') as wiki_file:
          wiki_file.write(request_json)
        
        data_revs[page_id] = unit['lastrevid']

    # Write new revision cache
    fd_revs.seek(0)
    json.dump(data_revs, fd_revs, indent=2)
    fd_revs.truncate()    


def getImageURL(image):
  time.sleep(.1) # Don't hammer the server
  request = sessionGet(
    url = 'https://gbf.wiki/api.php',
    params = {
      'action': 'query',
      'prop': 'imageinfo',
      'iiprop': 'url',
      'format': 'json',
      'titles': 'File:' + image
    })
  request_json = request.json()['query']['pages']
  try:
    return next(iter(request_json.values()))['imageinfo'][0]['url']
  except:
    print(request_json)
    raise

def downloadNewData():
  # Create working directory
  """
  path = os.path.join(os.getcwd(), datetime.datetime.now().strftime("%Y%m%d-%H%M%S"))
  try:
    print('Creating ' + path)
    os.mkdir(path)
  except:
    print("Unexpected error:", sys.exc_info())
    sys.exit(2)
  """
  path = os.path.join(os.getcwd(), 'data')
  downloadCategory(path, 'characters')
  updateCache('characters')
  time.sleep(.1)
  downloadCategory(path, 'summons')
  updateCache('summons')
  time.sleep(.1)
  downloadCargo(path, 'weapons', "rarity='SSR'")
  time.sleep(.1)
  downloadCargo(path, 'class_skill', order_by='row,class,ix', unique_ident=['class', 'name'])
  time.sleep(.1)


def getTemplateValue(template, value):
  try:
    return str(template.get(value).value).strip()
  except:
    print(str(template.get('name').value).strip(), str(template.get('id').value).strip())
    raise

def getTemplateValueOrDefault(template, value, default):
  if template.has(value):
    result = str(template.get(value).value).strip()
    if len(result) > 0:
      return result
  return default

def getTemplateValueOrNone(template, value):
  return getTemplateValueOrDefault(template, value, default=None)

def updateCharacters():
  cache_dir = os.path.join(os.getcwd(), 'data', 'cache')
  images_file = os.path.join('data', 'characters.images')
  images_dir = os.path.join('..', FRONTEND_DIR, 'src', 'img', 'chara_skills')
  values = []
  weaponspec_values = []
  skills = []
  skin_values = []
  ougi_values = []

  with open(os.path.join('data', 'characters_category.json'), 'r', encoding='utf8') as fd, open(images_file, 'w', encoding='utf8') as images_file:
    data = json.load(fd)

    for unit in data:
      page_id = str(unit['pageid'])
      name = ''

      try:
        with open(os.path.join(cache_dir, page_id + '.page'), 'r', encoding='utf8') as page_file:
          template = None
          skins = []
          for t in mwparserfromhell.parse(page_file.read()).filter_templates():
            if t.name.matches('Character'):
              template = t
            elif t.name.matches('CharSkin'):
              skins.append(getTemplateValue(t, 'id')[:-3])
          
          # Images
          images_file.write('wget -nc http://game-a.granbluefantasy.jp/assets_en/img/sp/assets/npc/quest/' + getTemplateValue(template, 'id') + '_01.jpg -O ./unit/' + getTemplateValue(template, 'id') + '.jpg\n')
          images_file.write('wget -nc http://game-a.granbluefantasy.jp/assets_en/img_mid/sp/assets/npc/m/' + getTemplateValue(template, 'id') + '_01.jpg -O ./unit_small/' + getTemplateValue(template, 'id') + '.jpg\n')
        
          character_id = getTemplateValue(template, 'id')[:-3]
          name = defines.unescape(unit['title'])
          rarity = defines.getValue(getTemplateValue(template, 'rarity'), defines.RARITIES)
          element = defines.getValue(getTemplateValue(template, 'element'), defines.ELEMENTS)
          chara_type = defines.getValue(getTemplateValue(template, 'type'), defines.CHARATYPES)
          # TODO Deal with multi-race characters
          race = getTemplateValue(template, 'race').split(',')[0]
          if race == 'Other':
            race = 'Unknown'
          race = defines.getValue(race, defines.RACES)        

          # Obtain
          recruit_id = None
          recruit = getTemplateValue(template, 'join')
          if recruit:
            if character_id in defines.CHARA_EVOKERS:
              recruit = 'Evoker'
            elif character_id in defines.CHARA_ETERNALS:
              recruit = 'Eternal'
            elif 'Valentine Premium Draw' in recruit:
              recruit = 'Valentine Premium Draw'
            elif 'Holiday Premium Draw' in recruit:
              recruit = 'Holiday Premium Draw'
            elif 'Summer Premium Draw' in recruit or getTemplateValue(template, 'obtain') == 'premium,swimsuit':
              recruit = 'Summer Premium Draw'
            elif 'Halloween Premium Draw' in recruit:
              recruit = 'Halloween Premium Draw'
            elif 'Zodiac Character' in recruit:
              recruit = 'Zodiac Premium Draw'
            elif 'Premium Gala' in recruit:
              recruit = 'Premium Gala'

            if recruit in defines.OBTAIN:
              recruit_id = defines.OBTAIN[recruit]

          # Check missing Atk and HP values
          if int(getTemplateValue(template, 'max_evo')) == 5:
            if getTemplateValueOrNone(template, 'flb_atk') == None:
              print('[WARN] flb_atk missing for', name, page_id)
            if getTemplateValueOrNone(template, 'flb_hp') == None:
              print('[WARN] flb_hp missing for', name, page_id)
          if int(getTemplateValue(template, 'max_evo')) >= 4:
            if getTemplateValueOrNone(template, 'max_atk') == None:
              print('[WARN] max_atk missing for', name, page_id)
            if getTemplateValueOrNone(template, 'max_hp') == None:
              print('[WARN] max_hp missing for', name, page_id)
    
          values += [(character_id, name, getTemplateValueOrDefault(template, 'jpname', ''),
            getTemplateValue(template, 'base_evo'), getTemplateValue(template, 'max_evo'),
            rarity, element, chara_type, race, recruit_id, getTemplateValue(template, 'release_date'),
            getTemplateValueOrNone(template, 'max_atk'), getTemplateValueOrNone(template, 'flb_atk'),
            getTemplateValueOrNone(template, 'max_hp'), getTemplateValueOrNone(template, 'flb_hp'),
            getTemplateValueOrNone(template, 'join_weapon') )]

          # Weapons
          for weapon in getTemplateValue(template, 'weapon').split(','):
            weaponspec_values += [(character_id, defines.getValue(weapon.strip(), defines.WEAPONTYPES))]
          
          # Skills
          for i in range(1, 5):
            if template.has('a' + str(i) + '_name'):
              skill_name = getTemplateValue(template, 'a' + str(i) + '_name')

              if skill_name:
                skill_name = mwparserfromhell.parse(skill_name.replace('<br />', ' ')).filter_text()[-1].strip()
                skill_icon = getTemplateValue(template, 'a' + str(i) + '_icon').split(',')[0]
                skill_desc = parseDescription(getTemplateValue(template, 'a' + str(i) + '_effdesc'))

                skill_obtain = mwparserfromhell.parse(getTemplateValue(template, 'a' + str(i) + '_oblevel')).filter_templates()
                if len(skill_obtain) > 0:
                  skill_template = None
                  for st in skill_obtain:
                    if st.name.matches('InfoOb'):
                      skill_template = st
                      break                
                  if skill_template == None:
                    print('[ERR] Skill', skill_name, 'for', name, 'id:', page_id, 'has no InfoOb')
                    skill_obtain = 1
                  else:
                    skill_obtain = int(getTemplateValue(skill_template, 'obtained'))
                    if skill_obtain < 1 or skill_obtain > 100:
                      print('[ERR] Skill', skill_name, 'for', name, 'id:', page_id, 'has incorrect value', skill_obtain)
                else:
                  if page_id not in defines.IGNORE_MISSING_SKILL:
                    print('[WARN] Skill', skill_name, 'for', name, 'id:', page_id, 'has no obtain level')
                  skill_obtain = 1
                skills += [(character_id, i-1, skill_name, skill_obtain, skill_desc)]

                # Look for skill img
                skill_filename = os.path.join(images_dir, str(character_id) + '_' + str(i-1) + '.png')
                if not os.path.isfile(skill_filename):
                  skill_url = getImageURL(skill_icon)
                  print("Writing", skill_url, 'to', skill_filename)
                  r = sessionGet(skill_url)

                  with open(skill_filename, 'wb') as image_file:                  
                    image_file.write(r.content)

          # Skins
          for s in skins:
            skin_values.append([s, character_id])
          
          # Ougi
          ougi_name = getTemplateValue(template, 'ougi_name')
          if len(ougi_name) > 0:
            ougi_label = parseDescription(getTemplateValueOrDefault(template, 'ougi_label', ''))
            ougi_desc = parseDescription(getTemplateValueOrDefault(template, 'ougi_desc', ''))
            ougi_values += [(character_id, 1, ougi_name, ougi_label + ' ' + ougi_desc)]
          ougi_name = getTemplateValueOrDefault(template, 'ougi2_name', '')
          if len(ougi_name) > 0:
            ougi_label = parseDescription(getTemplateValueOrDefault(template, 'ougi2_label', ''))
            ougi_desc = parseDescription(getTemplateValueOrDefault(template, 'ougi2_desc', ''))
            ougi_values += [(character_id, 2, ougi_name, ougi_label + ' ' + ougi_desc)]
          ougi_name = getTemplateValueOrDefault(template, 'ougi3_name', '')
          if len(ougi_name) > 0:
            ougi_label = parseDescription(getTemplateValueOrDefault(template, 'ougi3_label', ''))
            ougi_desc = parseDescription(getTemplateValueOrDefault(template, 'ougi3_desc', ''))
            ougi_values += [(character_id, 3, ougi_name, ougi_label + ' ' + ougi_desc)]
          ougi_name = getTemplateValueOrDefault(template, 'ougi4_name', '')
          if len(ougi_name) > 0:
            ougi_label = parseDescription(getTemplateValueOrDefault(template, 'ougi4_label', ''))
            ougi_desc = parseDescription(getTemplateValueOrDefault(template, 'ougi4_desc', ''))
            ougi_values += [(character_id, 4, ougi_name, ougi_label + ' ' + ougi_desc)]

      except Exception as e:
        raise type(e)(str(e) + ' happens for %s (%s)' % (name, page_id)).with_traceback(sys.exc_info()[2])


  if addToDB:
    print('Updating Character table...')
    database.dico_tables.get('WeaponSpecialty').drop()
    database.dico_tables.get('Character').drop()
    database.dico_tables.get('Character').insert(values)
    database.dico_tables.get('WeaponSpecialty').insert(weaponspec_values)
    database.dico_tables.get('CharacterSkill').drop()
    database.dico_tables.get('CharacterSkill').insert(skills)
    database.dico_tables.get('Skin_Character').drop()
    database.dico_tables.get('Skin_Character').insert(skin_values)
    database.dico_tables.get('CharacterOugi').drop()
    database.dico_tables.get('CharacterOugi').insert(ougi_values)
  if verbose:
    print(values)
    print(weaponspec_values)
    print(ougi_values)


def updateSummons():
  cache_dir = os.path.join(os.getcwd(), 'data', 'cache')
  working_file = os.path.join('data', 'summons_category.json')
  images_file = os.path.join('data', 'summons.images')
  values = []
  auras = []

  with open(working_file, "r", encoding='utf8') as read_file, open(images_file, 'w', encoding='utf8') as images_file:
    data = json.load(read_file)

    for summon in data:
      page_id = str(summon['pageid'])
      page_title = summon['title']

      if page_title.endswith(' List') or page_title.startswith('Category:'):
        continue

      with open(os.path.join(cache_dir, page_id + '.page'), 'r', encoding='utf8') as page_file:
        template = None
        for t in mwparserfromhell.parse(page_file.read()).filter_templates():
          if t.name.matches('Summon'):
            template = t
            break

        summon_id = getTemplateValue(template, 'id')[:-3]
        rarity = getTemplateValue(template, 'rarity')

        # Filter Seraphim Cradle / Archangel Queen
        if summon_id == '2040199' or summon_id == '2030017':
          continue
        # Filter normal and rare
        if rarity == 'n' or rarity == 'r':
          continue

        # Images
        images_file.write('wget -nc http://game-a.granbluefantasy.jp/assets_en/img_mid/sp/assets/summon/party_sub/' + getTemplateValue(template, 'id') + '.jpg -O ./unit/' + getTemplateValue(template, 'id') + '.jpg\n')
        images_file.write('wget -nc http://game-a.granbluefantasy.jp/assets_en/img_mid/sp/assets/summon/m/' + getTemplateValue(template, 'id') + '.jpg -O ./unit_small/' + getTemplateValue(template, 'id') + '.jpg\n')
        
        # How to obtain
        obtain = None
        obtainValue = getTemplateValue(template, 'obtain')
        if obtainValue.startswith("premium"):
          if obtainValue == 'premium,normal':
            obtain = defines.OBTAIN['[[Premium Draw]]']
          elif obtainValue == 'premium,summer' or obtainValue == 'premium,swimsuit':
            obtain = defines.OBTAIN['Summer Premium Draw']
          elif obtainValue == 'premium,non-ticketable':
            obtain = defines.OBTAIN['Premium Gala']
          elif obtainValue == 'premium,holiday':
            obtain = defines.OBTAIN['Holiday Premium Draw']
          else:
            print('Unknown premium value for summon ' + getTemplateValue(template, 'name') + ': ' + obtainValue)
        elif summon_id in defines.SUMMON_EVOKERS:
          obtain = defines.OBTAIN['Evoker']

        release_date = getTemplateValue(template, 'release_date')
        if len(release_date) < 1:
          release_date = None
        
        name = defines.unescape(getTemplateValue(template, 'name'))
        if name.startswith('[Skybound] '):
          name = name.replace('[Skybound] ', '')
        elif name == '{{PAGENAME}}':
          name = page_title
        elif summon_id == '2040335':
          name += ' (Summer)'
        
        if name.find('<!--') > 0:
          name = name[:name.find('<!--')]

        # Check missing Atk and HP values
        if int(getTemplateValue(template, 'max_evo')) == 5:
          if getTemplateValueOrNone(template, 'atk4') == None:
            print('[WARN] atk4 missing for', name, page_id)
          if getTemplateValueOrNone(template, 'hp4') == None:
            print('[WARN] hp4 missing for', name, page_id)
        if int(getTemplateValue(template, 'max_evo')) >= 4:
          if getTemplateValueOrNone(template, 'atk3') == None:
            print('[WARN] atk3 missing for', name, page_id)
          if getTemplateValueOrNone(template, 'hp3') == None:
            print('[WARN] hp3 missing for', name, page_id)
        if int(getTemplateValue(template, 'max_evo')) >= 3:
          if getTemplateValueOrNone(template, 'atk2') == None:
            print('[WARN] atk2 missing for', name, page_id)
          if getTemplateValueOrNone(template, 'hp2') == None:
            print('[WARN] hp2 missing for', name, page_id)
          if getTemplateValueOrNone(template, 'atk1') == None:
            print('[WARN] atk1 missing for', name, page_id)
          if getTemplateValueOrNone(template, 'hp1') == None:
            print('[WARN] hp1 missing for', name, page_id)
      
        # Values
        values += [(summon_id, name, getTemplateValue(template, 'jpname'), getTemplateValue(template, 'base_evo'), getTemplateValue(template, 'max_evo'),
          defines.getValue(rarity, defines.RARITIES), defines.getValue(getTemplateValue(template, 'element'), defines.ELEMENTS),
          obtain, release_date,
          getTemplateValueOrNone(template, 'atk1'), getTemplateValueOrNone(template, 'atk2'),
          getTemplateValueOrNone(template, 'atk3'), getTemplateValueOrNone(template, 'atk4'),
          getTemplateValueOrNone(template, 'hp1'), getTemplateValueOrNone(template, 'hp2'), 
          getTemplateValueOrNone(template, 'hp3'), getTemplateValueOrNone(template, 'hp4'), None )]
        
        # Auras
        if not page_id in defines.IGNORE_MISSING_AURA:
          if int(getTemplateValue(template, 'max_evo')) == 5:
            if getTemplateValueOrNone(template, 'aura4') == None:
              print('[WARN] aura4 missing for', name, page_id)
          if int(getTemplateValue(template, 'max_evo')) >= 4:
            if getTemplateValueOrNone(template, 'aura3') == None:
              print('[WARN] aura3 missing for', name, page_id)
          if int(getTemplateValue(template, 'max_evo')) >= 3:
            if getTemplateValueOrNone(template, 'aura2') == None:
              print('[WARN] aura2 missing for', name, page_id)

        auras += [(summon_id,
          parseDescription(getTemplateValueOrNone(template, 'aura1')),
          parseDescription(getTemplateValueOrNone(template, 'aura2')),
          parseDescription(getTemplateValueOrNone(template, 'aura3')),
          parseDescription(getTemplateValueOrNone(template, 'aura4')),
          parseDescription(getTemplateValueOrNone(template, 'subaura1')),
          parseDescription(getTemplateValueOrNone(template, 'subaura2')),
          parseDescription(getTemplateValueOrNone(template, 'subaura3')),
          parseDescription(getTemplateValueOrNone(template, 'subaura4')),
          False )]

  if addToDB:
    print('Updating Summon table...')
    database.dico_tables.get('SummonAura').drop()
    database.dico_tables.get('Summon').drop()
    database.dico_tables.get('Summon').insert(values)
    database.dico_tables.get('SummonAura').insert(auras)
  if verbose:
    print(values)


def downloadSkillIcon(images_dir, icon):
  skill_filename = os.path.join(images_dir, icon)
  if not os.path.isfile(skill_filename):
    skill_url = getImageURL(icon)
    print("Writing", skill_url, 'to', skill_filename)
    r = sessionGet(skill_url)

    with open(skill_filename, 'wb') as image_file:                  
      image_file.write(r.content)


def updateWeapons():
  working_file = os.path.join('data', 'weapons.json')
  images_file = os.path.join('data', 'weapons.images')
  images_dir = os.path.join('..', FRONTEND_DIR, 'src', 'img', 'weapon_skills')
  values = []
  ougis = []
  skills = []
  skills_desc = {}
  skills_desc_regex = re.compile('([a-z]+) boost ')
  weapon_ids = set()
  
  with open(working_file, "r", encoding='utf8') as read_file, open(images_file, 'w', encoding='utf8') as images_file:
    data = json.load(read_file)
    add_element = set()
    
    for weapon in data:
      if weapon['id'].endswith('_note'):
        add_element.add(weapon['name'])

    for weapon in data:
      # Filter weird data
      if weapon['id'].endswith('_note'):
        continue

      # Image	
      images_file.write('wget -nc http://game-a.granbluefantasy.jp/assets_en/img_mid/sp/assets/weapon/m/' + weapon['id'] + '.jpg -O ./weapon/' + weapon['id'] + '.jpg\n')

      weapon_id = weapon['id'][:-2]
      weapon_ids.add(int(weapon_id))

      name = defines.unescape(weapon['name'])
      if name in add_element:
        name += ' (' + weapon['element'][0].upper() + weapon['element'][1:] + ')'

      # Check missing Atk and HP values
      if int(weapon['evo max']) == 5:
        if int(weapon['atk4']) == 0:
          print('[ERR] atk4 missing for', name, weapon_id)
        if int(weapon['hp4']) == 0:
          print('[ERR] hp4 missing for', name, weapon_id)
      if int(weapon['evo max']) >= 4:
        if int(weapon['atk3']) == 0:
          if weapon_id not in defines.IGNORE_MISSING_WEAPON_STATS:
            print('[WARN] atk3 missing for', name, weapon_id)
          weapon['atk3'] = int(weapon['atk1']) + int(weapon['atk2'])
        if int(weapon['hp3']) == 0:
          if weapon_id not in defines.IGNORE_MISSING_WEAPON_STATS:
            print('[WARN] hp3 missing for', name, weapon_id)
          weapon['hp3'] = int(weapon['hp1']) + int(weapon['hp2'])
      if int(weapon['evo max']) >= 3:
        if int(weapon['atk2']) == 0:
          if int(weapon['atk3']) > 0 and int(weapon['atk1']) > 0:
            weapon['atk2'] = int(weapon['atk3']) - int(weapon['atk1'])
          else:
            print('[ERR] atk2 missing for', name, weapon_id)          
        if int(weapon['hp2']) == 0:
          if int(weapon['hp3']) > 0 and int(weapon['hp1']) > 0:
            weapon['hp2'] = int(weapon['hp3']) - int(weapon['hp1'])
          else:
            print('[ERR] hp2 missing for', name, weapon_id)
        if int(weapon['atk1']) == 0:
          print('[ERR] atk1 missing for', name, weapon_id)
        if int(weapon['hp1']) == 0:
          print('[ERR] hp1 missing for', name, weapon_id)

      # Base infos
      values += [(weapon_id, name, weapon['jpname'], weapon['evo base'], weapon['evo max'],
        defines.getValue(weapon['rarity'], defines.RARITIES), defines.getValue(weapon['element'], defines.ELEMENTS),
        defines.getValue(weapon['type'], defines.WEAPONTYPES),
        int(weapon['atk1']), int(weapon['atk2']), int(weapon['atk3']), int(weapon['atk4']),
        int(weapon['hp1']), int(weapon['hp2']), int(weapon['hp3']), int(weapon['hp4']) )]
      
      # Ougi
      ougis += [(weapon_id, parseDescription(weapon['ca1 desc']), parseDescription(weapon['ca2 desc']), parseDescription(weapon['ca3 desc']))]

      # Icons
      for (s, i) in [('s1 ', 1), ('s1u1 ', 1), ('s2 ', 2), ('s2u1 ', 2), ('s3 ', 3), ('s3u1 ', 3)]:
        skillname = weapon[s + 'name'].strip().replace('  ', ' ')

        # Ignore skills with no names. Sometimes, they have non-existing icons...
        if len(skillname) > 0 and len(weapon[s + 'icon']) > 0:
          icon = weapon[s + 'icon'].lower().replace(' ', '_')
          downloadSkillIcon(images_dir, icon)

          skill_key = defines.getWeaponSkillKey(int(weapon_id), i)
          if skill_key != None:
            for key_image in defines.WEAPONS_KEYS_ICONS[skill_key]:              
              downloadSkillIcon(images_dir, key_image)

          skill_lvl = defines.toInt(weapon[s + 'lvl'])
          if s == 's1u1 ' and skill_lvl == 1:
            skill_lvl = 101

          # Description
          skill_desc = parseDescription(weapon[s + 'desc'])

          # Test boost type in descriptions
          regex_result = skills_desc_regex.match(skill_desc.lower())
          boost = None
          if regex_result:
            boost = regex_result.group(1)
            boost_key = skillname + icon
            if not boost_key in skills_desc:
              skills_desc[boost_key] = boost
              if boost not in defines.BOOST_TYPES:
                print('[WARN] Unknown boost type', boost, 'for skill', skillname)
            elif skills_desc[boost_key] != boost:
              print('[ERR] Multiple descriptions for a skill:', skillname, skills_desc[boost_key], boost)

          # To clear orphaned skills:
          # DELETE FROM Weapon_Skilldata
          #  WHERE Weapon_Skilldata.skilldataid IN (SELECT Weapon_Skilldata.skilldataid
          #  FROM Weapon_Skilldata
          #  FULL JOIN Weapon_Skill
          #  ON Weapon_Skilldata.skilldataid = Weapon_Skill.skilldataid
          #  WHERE Weapon_Skilldata.skilldataid IS NULL OR Weapon_Skill.skilldataid IS NULL)

          # Get skilldata id
          skilldataId = database.dico_tables.get('Weapon_SkillData').getCount()
          skilldata = [(skilldataId, icon, skillname, None, boost)]
          skilldataId = database.dico_tables.get('Weapon_SkillData').insert(skilldata, returning="skilldataId")

          skills += [(weapon_id, i, skill_lvl, skill_key, skilldataId, skill_desc)]

  if addToDB:
    print('Updating Database...')
    database.dico_tables.get('Weapon_Skill').drop()
    database.dico_tables.get('Weapon_Ougi').drop()
    database.dico_tables.get('Weapon').drop()
    database.dico_tables.get('Weapon').insert(values)
    database.dico_tables.get('Weapon_Ougi').insert(ougis)
    database.dico_tables.get('Weapon_Skill').insert(skills)

    orphans = database.dico_tables.get('Weapon').getOrphans(weapon_ids, 'weaponId')
    database.dico_tables.get('Weapon_Skill').removeOrphans(orphans, 'weaponId')
    database.dico_tables.get('Weapon').removeOrphans(orphans, 'weaponId')

  if verbose:
    print(values)
    print(skills)
    print(ougis)


def updateClasses():
  working_file = os.path.join('data', 'class_skill.json')
  images_dir = os.path.join('..', FRONTEND_DIR, 'src', 'img', 'class_skills')

  with open(working_file, "r", encoding='utf8') as read_file:
    class_values = []
    skill_values = []
    junction = []
    families = {}
    
    data = sorted(json.load(read_file), key=functools.cmp_to_key(defines.sortClasse))

    # New skills are pushing the index, but it's too late to fix the model
    # Hardcode an index for them
    new_skills = ['Ulfhedinn', 'Lightning Strike', 'Spring\'s Gate', 'Oratorio', 'Time On Target', 'Resounding Chant']
    new_skills_id_start = 224
    new_skills_count = 0

    for (classe_name, classe_id) in defines.CLASSES:
      row = ''
      family_name = ''
      skills = [None, None, None, None]

      for skill in data:        
        if skill['class'] != classe_name:
          continue

        if row == '':
          row = skill['row']
        elif row != skill['row']:
          raise ValueError('Multiple row values for ' + classe_name)

        if family_name == '':
          family_name = skill['family']
          if family_name not in families:
            families[family_name] = len(families)
        elif family_name != skill['family']:
          raise ValueError('Multiple families for ' + classe_name)

        if skill['ex'] != '1' and skill['ex'] != '0':
          raise ValueError('Bad ex value for ' + skill['name'])

        isSubSkill = skill['ex'] == '1' and skill['ix'][0] == 's'
        isExMastery = skill['ix'][0] == 'e'
        # For ExI classes, s2 and s3 are considered Ex mastery (eg: Neko can use Fate Foreseen)
        if row == defines.CLASSES_ROWS[4] and (skill['ix'] == 's2' or skill['ix'] == 's3'):
          isExMastery = True
        
        skill_id = len(skill_values) - new_skills_count
        if skill_id >= new_skills_id_start:
          skill_id += new_skills_count
        if skill['name'] in new_skills:
          skill_id = new_skills_id_start + new_skills_count
          new_skills_count += 1

        skill_filename = os.path.join(images_dir, str(skill_id) + '.png')
        if not os.path.isfile(skill_filename):
          skill_url = getImageURL(skill['icon'])
          print("Writing", skill_url, 'to', skill_filename)
          r = sessionGet(skill_url)

          with open(skill_filename, 'wb') as image_file:                  
            image_file.write(r.content)
        
        skill_values += [(skill_id, skill['name'], None if isSubSkill else families[family_name], isExMastery)]

        if skill['ix'][0] == 's':
          skills[int(skill['ix'][1:]) - 1] = skill_id        

      class_values += [(classe_id, classe_name, defines.getValue(row, defines.CLASSES_ROWS), families[family_name])]

      for index, sk in enumerate(skills):
        if sk == None:
          break
        junction += [(classe_id, sk, index)]
    
    if addToDB:
      print('Updating Class table...')
      database.dico_tables.get('Class_ClassSkill').drop()
      database.dico_tables.get('Class').drop()
      database.dico_tables.get('ClassSkill').drop()
      database.dico_tables.get('ClassSkill').insert(skill_values)
      database.dico_tables.get('Class').insert(class_values)
      database.dico_tables.get('Class_ClassSkill').insert(junction)
    if verbose:
      print(skill_values)
      print(class_values)
      print(junction)
      print(families)


def testFunction():
  skill_desc = ""
  skill_desc = parseDescription(skill_desc)

  print(skill_desc)
  print('')


def printHelp():
  print('-h: Print help')
  print('-d: Download new data in new directory')
  print('--all: Update everything')
  print('--cha: Update characters')
  print('--sum: Update summons')
  print('--wea: Update weapons')
  print('--cla: Update classes')
  print('')
  print('-n: No DB operations')
  print('-v: Verbose (print value arrays)')
  sys.exit(1)

def main(argv):
  try:
    opts, args = getopt.getopt(argv, 'hdnv', ['cha', 'sum', 'wea', 'cla', 'all', 'test'])
  except getopt.GetoptError:
    printHelp()
  if len(argv) == 0 or (len(opts) == 0 and len(args) > 0):
    printHelp()

  # Priority args
  for opt, _ in opts:
    if opt == '-h':
      printHelp()
    elif opt == '-n':
      global addToDB
      addToDB = False
    elif opt == '-v':
      global verbose
      verbose = True

  for opt, _ in opts:
    if opt == '-d':
      downloadNewData()
    elif opt == '--cha':
      updateCharacters()
    elif opt == '--sum':
      updateSummons()
    elif opt == '--wea':
      updateWeapons()
    elif opt == '--cla':
      updateClasses()
    elif opt == '--all':
      updateCharacters()
      updateSummons()
      updateWeapons()
      updateClasses()
    elif opt == '--test':
      testFunction()
    elif opt != '-n' and opt != '-v':
      printHelp()

if __name__ == '__main__':
  main(sys.argv[1:])