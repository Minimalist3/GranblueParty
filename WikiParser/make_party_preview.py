#!/usr/bin/python3
# -*- coding: utf-8 -*-

import glob
import os
import queue
import socketserver
import sys
import threading

from PIL import Image, ImageDraw, ImageFont

from config import dbconfig, defines

# Use a queue based on a set to prevent computing the same image multiple times
# We don't really care about priority
class SetQueue(queue.Queue):
  def _init(self, maxsize):
    self.queue = set()
  def _put(self, item):
    self.queue.add(item)
  def _get(self):
    return self.queue.pop()

requests_queue = SetQueue()

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
  allow_reuse_address = True

class PartyRequestHandler(socketserver.BaseRequestHandler):
  def handle(self):
    while True:
      # self.request is the TCP socket connected to the client
      self.data = str(self.request.recv(1024).strip(), "utf-8")

      if not self.data:
        return

      if self.data == 'EXIT':
        self.server.shutdown()
        return

      try:
        value = int(self.data)
        requests_queue.put(value)
      except ValueError:
        pass

class PartyPreviewServer:
  def __init__(self):
    self.server = None

  def server_forever(self):
    print('Starting previews server on port', 6000)
    self.server = ThreadedTCPServer(('localhost', 6000), PartyRequestHandler)
    try:
      self.server.serve_forever()
    except KeyboardInterrupt:
      pass
    self.server.server_close()


previews_path = None

font = ImageFont.truetype('DejaVuSansCondensed.ttf', 16)
TOP_BORDER = 10
LEFT_BORDER = 10
LINE_HEIGHT = 16
LINE_SPACING = 1

class Panel:
  def __init__(self):
    self.panel = Image.new('RGB', (290,300), (0,0,0))
    self.panel_draw = ImageDraw.Draw(self.panel)
    self.x = LEFT_BORDER
    self.y = TOP_BORDER

  def addText(self, text, fill=(255,255,255)):
    txt_x, _ = self.panel_draw.textsize(text, font=font)

    lower = LINE_HEIGHT
    bbox = font.getmask(text).getbbox()
    if bbox:
      lower = bbox[3]
    delta_y = (LINE_HEIGHT - lower) / 2

    self.panel_draw.text((self.x, self.y + delta_y), text, font=font, fill=fill)
    self.x += txt_x

  def endLine(self):
    self.x = LEFT_BORDER
    self.y += LINE_HEIGHT + LINE_SPACING

  def addLine(self, text, fill=(255,255,255)):
    self.addText(text, fill)
    self.endLine()


def countItemsInCategory(json, key):
  count = 0
  for item in json[key]:
    if item:
      count += 1
  return count

def fetchParty(party_id):
  # fetch party details
  dbconfig.getCursor().execute('SELECT partydata, EXTRACT(EPOCH FROM updated)::bigint FROM party WHERE partyid = %s', [party_id])
  result = dbconfig.getCursor().fetchone()
  party_json = None
  updated = None

  if result != None:
    party_json = result[0]
    updated = result[1]
    if updated == None:
      updated = 0
    query = 'SELECT '
    values = []

    # Characters
    if 'characters' in party_json and countItemsInCategory(party_json, 'characters') > 0:
      query += '(SELECT array_agg(characters.nameen) FROM ( '
      sub_query = ''
      for character in party_json['characters']:
        if sub_query:
          sub_query += ' UNION ALL '
        if character:
          sub_query += '(SELECT nameen FROM character WHERE characterid = %s)'
          values.append(character)
        else:
          sub_query += '(SELECT NULL AS nameen)'
      query += sub_query + ') AS characters) AS characters, '
    else:
      query += 'NULL, '

    # Summons
    if 'summons' in party_json and countItemsInCategory(party_json, 'summons') > 0:
      query += '(SELECT array_agg(summons.nameen) FROM ( '
      sub_query = ''
      for summon in party_json['summons']:
        if sub_query:
          sub_query += ' UNION ALL '
        if summon:
          sub_query += '(SELECT nameen FROM summon WHERE summonid = %s)'
          values.append(summon)
        else:
          sub_query += '(SELECT NULL AS nameen)'
      query += sub_query + ') AS summons) AS summons, '
    else:
      query += 'NULL, '

    # Weapons
    if 'weapons' in party_json and countItemsInCategory(party_json, 'weapons') > 0:
      query += '(SELECT array_agg(weapons.nameen) FROM ( '
      sub_query = ''
      for weapon in party_json['weapons']:
        if sub_query:
          sub_query += ' UNION ALL '
        if weapon:
          sub_query += '(SELECT nameen FROM weapon WHERE weaponid = %s)'
          values.append(weapon)
        else:
          sub_query += '(SELECT NULL AS nameen)'
      query += sub_query + ') AS weapons) AS weapons, '
    else:
      query += 'NULL, '

    # Class
    if 'classe' in party_json:
      query += 'class.nameen AS class FROM class WHERE class.classid = %s'
      values.append(party_json['classe'])
    else:
      query += 'NULL'

    dbconfig.getCursor().execute(query, values)
    result = dbconfig.getCursor().fetchone()

  return result, party_json, updated

def getStarsColor(count):
  if count == 3:
    return (255, 168, 38)
  elif count == 4:
    return (227, 183, 255)
  elif count == 5:
    return (161, 227, 255)
  return (255,255,255)

def getJSONValue(obj, key, index):
  if key in obj:
    result = obj[key][index]
    if result and isinstance(result, int):
      return result
  return 0

def createImage(party_data, party_json, party_id, updated):
  image = Image.new('RGB', [600, 300], (0,0,0))

  panel_1 = Panel()
  # Class
  if party_data[3] != None:
    panel_1.addLine(party_data[3])
  else:
    panel_1.endLine()

  # Characters
  if party_data[0]:
    for i in range(5):
      if i < len(party_data[0]) and party_data[0][i]:
        stars = getJSONValue(party_json, 'characters_stars', i)
        pluses = getJSONValue(party_json, 'characters_pluses', i)
        panel_1.addText(str(stars) + '★ ', fill=getStarsColor(stars))
        panel_1.addText(party_data[0][i])
        if pluses > 0:
          panel_1.addText(' +' + str(pluses), fill=(237, 234, 154))
        panel_1.endLine()
      else:
        panel_1.endLine()

  panel_1.endLine()

  # Summons
  if party_data[1]:
    for i in [0, 5, 1, 2, 3, 4]:
      if i < len(party_data[1]) and party_data[1][i]:
        if i == 0:
          panel_1.addLine('Main:', fill=(210, 210, 210))
          panel_1.addText('  ')
        elif i == 5:
          panel_1.addLine('Friend:', fill=(210, 210, 210))
          panel_1.addText('  ')

        stars = getJSONValue(party_json, 'summons_stars', i)
        pluses = getJSONValue(party_json, 'summons_pluses', i)
        panel_1.addText(str(stars) + '★ ', fill=getStarsColor(stars))
        panel_1.addText(party_data[1][i])
        if pluses > 0:
          panel_1.addText(' +' + str(pluses), fill=(237, 234, 154))
        panel_1.endLine()

  # Weapons
  panel_2 = Panel()
  if party_data[2]:
    for i in range(10):
      if i < len(party_data[2]) and party_data[2][i]:
        stars = getJSONValue(party_json, 'weapons_stars', i)
        pluses = getJSONValue(party_json, 'weapons_pluses', i)
        sl = getJSONValue(party_json, 'weapons_skill_levels', i)
        panel_2.addText(str(stars) + '★ ', fill=getStarsColor(stars))
        panel_2.addText(party_data[2][i])

        if sl > 1:
          panel_2.addText(' sl' + str(sl), fill=(252, 217, 241))
        if pluses > 0:
          panel_2.addText(' +' + str(pluses), fill=(237, 234, 154))

        panel_2.endLine()

        if 'weapons_skill_names' in party_json:
          for skill in party_json['weapons_skill_names'][i]:
            if skill:
              panel_2.addLine('•  ' + skill)

  # Assemble image
  image.paste(panel_1.panel, (10, 0))
  image.paste(panel_2.panel, (300, 0))

  # Write file
  for old_party in glob.glob(os.path.join(previews_path, 'party_' + str(party_id) + '.*.png')):
    os.remove(old_party)
  filename = 'party_' + str(party_id) + '.' + str(updated) + '.png'
  image.save(os.path.join(previews_path, filename))

def processQueue():
  while True:
    id = requests_queue.get()
    processRequest(id)

def processRequest(id):
  party_data, party_json, updated = fetchParty(id)
  if party_data != None:
    createImage(party_data, party_json, id, updated)
  else:
    print('Unknown party', id)


def main(argv):
  global previews_path, server

  if len(argv) < 1:
    print('One argument needed: absolute path to previews root directory', previews_path)
    return 1

  if not os.path.abspath(argv[0]):
    print('Path is not absolute', previews_path)
    return 2

  previews_path = os.path.join(argv[0], 'party')
  
  # Make sure the directory exists
  if not os.path.exists(previews_path) or not os.path.isdir(previews_path):
    print('Directory doesn\'t exist', previews_path)
    return 3

  if len(argv) == 2 and argv[1] == '--all':
    dbconfig.getCursor().execute('SELECT partyid FROM party')
    result = dbconfig.getCursor().fetchall()
    print('Processing', len(result), 'parties')
    for party in result:
      processRequest(party[0])

  else:
    # Set non-blocking, read-only, SQL connection
    dbconfig.setAutoCommit()

    # Start the processing queue in a single thread
    queue_thread = threading.Thread(target=processQueue)
    queue_thread.daemon = True
    queue_thread.start()

    # The server uses other threads
    server = PartyPreviewServer()
    server.server_forever()

if __name__ == '__main__':
  main(sys.argv[1:])
