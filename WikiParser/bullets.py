#!/usr/bin/python3

import getopt
import json
import os
import sys

from config import defines
import mwparserfromhell

from config.wikirequest import getImageURL, sessionGet

FRONTEND_DEST = os.path.join(os.getcwd(), '..', defines.getConfig('config/config.ini', 'path')['frontend'], 'src', 'js')
FRONTEND_IMAGES = os.path.join(os.getcwd(), '..', defines.getConfig('config/config.ini', 'path')['frontend'], 'src', 'img', 'item')

# Write BulletTooltips template to bullets.page
def getTemplate():
  request = sessionGet(
    url = 'https://gbf.wiki/api.php',
    params = {
      'action': 'query',
      'prop': 'revisions',
      'rvprop': 'content',
      'rvslots': '*',
      'format': 'json',
      'titles': 'Template:BulletTooltips'
    })
  
  # https://gbf.wiki/api.php?action=query&prop=revisions&titles=Template:BulletTooltips&rvprop=content&format=json
  # BulletTable: 95741
  # BulletTooltips: 20493
  request_json = request.json()['query']['pages']['20493']['revisions'][0]['slots']['main']['*']
  with open(os.path.join('data', 'bullets.page'), 'w', encoding='utf8') as wiki_file:
    wiki_file.write(request_json)

# Parse bullets.page
def parseTemplate():
  categories = []
  with open(os.path.join('data', 'bullets.page'), 'r', encoding='utf8') as template:
    bullets = mwparserfromhell.parse(template.read()).filter(recursive=False)
    category = ''

    for bullet in bullets:
      if isinstance(bullet, mwparserfromhell.nodes.heading.Heading):
        category = bullet.title.filter_text()[0].value
      elif isinstance(bullet, mwparserfromhell.nodes.tag.Tag):
        if category != '':
          categories.append(parseCategory(category, bullet))
          category = ''

  with open(os.path.join(FRONTEND_DEST, 'bullets.js'), 'w', encoding='utf8') as js_file:
    js_file.write(
      'export default Object.freeze(' +
      json.dumps(categories, default=lambda o: o.encode(), indent=2) +
      ');')
    
  images_cache = set()
  for category in categories:
    for bullet in category.bullets:
      if bullet.image_dest_name not in images_cache:
        images_cache.add(bullet.image_dest_name)
        bullet.downloadImage()

      for item in bullet.components:
        if item.image_dest_name not in images_cache:
          images_cache.add(item.image_dest_name)
          item.downloadImage()


# A group of bullets
class BulletGroup:
  def __init__(self, name) -> None:
    self.name = name.strip()
    self.bullets = []

  def __getitem__(self, key):
    return self.bullets[key]

  def __setitem__(self, key, value):
    self.bullets[key] = value

  def addBullet(self, name) -> None:
    self.bullets.append(Bullet(name))
  
  def encode(self):
    return {
      'name': self.name,
      'bullets': self.bullets
    }
  
  def __repr__(self) -> str:
    return self.name + '\n' + str(self.bullets)

# Image of an item
class Image:
  def __init__(self, name) -> None:
    self.image_src = self.name.replace(':', '-').replace('Chaser', 'Chaiser') + ' square.jpg'
    self.image_dest_name = self.name.replace(' ', '').replace('-', '').replace('\'', '').replace(':', '').casefold()
    self.image_dest = os.path.join(FRONTEND_IMAGES, self.image_dest_name + '.jpg')

  def hasImage(self):
    return os.path.isfile(self.image_dest)
  
  def downloadImage(self):
    if not self.hasImage():
      print("Downloading " + self.image_src)
      image_url = getImageURL(self.image_src)
      r = sessionGet(image_url)
      with open(self.image_dest, 'wb') as image_file:
        image_file.write(r.content)

# One bullet
class Bullet(Image):
  def __init__(self, name) -> None:
    self.name = name
    self.components = []
    self.element = None
    Image.__init__(self, self.name)

  def setElement(self, element) -> None:
    self.element = element

  def addComponent(self, name, quantity) -> None:
    self.components.append(Component(name, quantity, self.element))

  def encode(self):
    return {
      'name': self.name,
      'image': self.image_dest_name,
      'items': self.components
    }

  def __repr__(self) -> str:
   if self.element is not None:
      return self.name + ': (' + self.element + ') ' + str(self.components) + '\n'
   return ""

# One component of a bullet
class Component(Image):
  def __init__(self, name, quantity, element) -> None:
    self.name = Component.getName(name, element)
    self.quantity = quantity
    Image.__init__(self, self.name)

  def getName(name, element) -> str:
    if element is None:
      return name
    
    if name == 'Urn':
      return element.capitalize() + ' ' + name
    elif name == 'Centrum':
      if element == 'fire':
        return ' Rubeus Centrum'
      if element == 'water':
        return 'Indicus Centrum'
      if element == 'earth':
        return 'Luteus Centrum'
      if element == 'wind':
        return 'Galbinus Centrum'
      if element == 'light':
        return 'Niveus Centrum'
      if element == 'dark':
        return 'Ater Centrum'
      raise Exception('Unknown element: ' + element)
    elif name == 'Six-Dragon Jewel':
      if element == 'fire':
        return ' Wilnas\'s Jewel'
      if element == 'water':
        return 'Wamdus\'s Jewel'
      if element == 'earth':
        return 'Galleon\'s Jewel'
      if element == 'wind':
        return 'Ewiyar\'s Jewel'
      if element == 'light':
        return 'Lu Woh\'s Jewel'
      if element == 'dark':
        return 'Fediel\'s Jewel'
      raise Exception('Unknown element: ' + element)
    elif name == 'Six-Dragon Advent Unique Item':
      if element == 'fire':
        return ' Smoldering Rubble'
      if element == 'water':
        return 'Abyssal Tragedy'
      if element == 'earth':
        return 'Insular Core'
      if element == 'wind':
        return 'Gale Rock'
      if element == 'light':
        return 'Thunderbolt Wheel'
      if element == 'dark':
        return 'Todestrieb'
      raise Exception('Unknown element: ' + element)
    
    return name

  def encode(self):
    return {
      'name': self.name,
      'image': self.image_dest_name,
      'quantity': int(self.quantity)
    }

  def __repr__(self) -> str:
    return self.quantity + ' ' + self.name + (' (OK)' if self.hasImage() else '')
  

# Parse each category of bullets.page
def parseCategory(category, template) -> BulletGroup:
  bullets = BulletGroup(category)
  for bullet_template in template.contents.filter_templates(2): # RECURSE_OTHERS
    bullets.addBullet(bullet_template.get(2).value.filter_text()[0].value)

    # Find components for this bullet
    for component in bullet_template.get(1).value.filter_templates()[1].params:
      item_split = component.split(',')
      if len(item_split) == 2:
        bullets[-1].addComponent(item_split[0], item_split[1])
      elif component.startswith('element'):
        bullets[-1].setElement(component.split('=')[1])

  return bullets

# Help
def printHelp():
  print("--get: Download a new template")
  print("--parse: Parse the current template")
  sys.exit(1)

def main(argv):
  if not os.path.isdir(FRONTEND_DEST):
    print("./config/config.ini doesn't contain the [path] section")
    return 1
  
  try:
    opts, args = getopt.getopt(argv, 'h', ['get', 'parse'])
  except getopt.GetoptError:
    printHelp()
  if len(argv) == 0 or (len(opts) == 0 and len(args) > 0):
    printHelp()

  for opt, _ in opts:
    if opt == '-h':
      printHelp()

  for opt, _ in opts:
    if opt == '--get':
      getTemplate()
      break
    if opt == '--parse':
      parseTemplate()
      break

if __name__ == '__main__':
  main(sys.argv[1:])
