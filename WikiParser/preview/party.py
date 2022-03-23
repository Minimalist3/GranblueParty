import glob
import os

from PIL import Image, ImageDraw, ImageFont

from config import dbconfig
from preview import paths

font = ImageFont.truetype('NotoSans-Regular.ttf', 16)
BORDER = 10
SPACING = 5
CLASS_X = 78
CLASS_Y = 142
WEAPON_X = 78
WEAPON_Y = 45
CHARA_FRONT_X = 78
CHARA_FRONT_Y = 142
CHARA_BACK_X = 84
CHARA_BACK_Y = 48
SUMMON_MAIN_X = 126
SUMMON_MAIN_Y = 95
SUMMON_GRID_X = 78
SUMMON_GRID_Y = 45

WEAPON_POSITIONS = [
  [BORDER, BORDER],
  [BORDER + (WEAPON_X + SPACING)    , BORDER],
  [BORDER + (WEAPON_X + SPACING) * 2, BORDER],
  [BORDER + (WEAPON_X + SPACING) * 3, BORDER],
  [BORDER + (WEAPON_X + SPACING)    , BORDER + (WEAPON_Y + SPACING)],
  [BORDER + (WEAPON_X + SPACING) * 2, BORDER + (WEAPON_Y + SPACING)],
  [BORDER + (WEAPON_X + SPACING) * 3, BORDER + (WEAPON_Y + SPACING)],
  [BORDER + (WEAPON_X + SPACING)    , BORDER + (WEAPON_Y + SPACING) * 2],
  [BORDER + (WEAPON_X + SPACING) * 2, BORDER + (WEAPON_Y + SPACING) * 2],
  [BORDER + (WEAPON_X + SPACING) * 3, BORDER + (WEAPON_Y + SPACING) * 2],
  [BORDER + (WEAPON_X + SPACING)    , BORDER + (WEAPON_Y + SPACING) * 3],
  [BORDER + (WEAPON_X + SPACING) * 2, BORDER + (WEAPON_Y + SPACING) * 3],
  [BORDER + (WEAPON_X + SPACING) * 3, BORDER + (WEAPON_Y + SPACING) * 3],
]
CHARA_POSITIONS = [
  [BORDER + (WEAPON_X + SPACING) * 4                                , BORDER],
  [BORDER + (WEAPON_X + SPACING) * 4 + (CHARA_FRONT_X + SPACING)    , BORDER],
  [BORDER + (WEAPON_X + SPACING) * 4 + (CHARA_FRONT_X + SPACING) * 2, BORDER],
  [BORDER + (WEAPON_X + SPACING) * 4 + 25                           , BORDER + CHARA_FRONT_Y + SPACING],
  [BORDER + (WEAPON_X + SPACING) * 4 + 25 + CHARA_BACK_X + 26       , BORDER + CHARA_FRONT_Y + SPACING],
]
SUMMON_POSITIONS = [
  [47                                                                , BORDER + (WEAPON_Y + SPACING) * 4],
  [47 + (SUMMON_MAIN_X + SPACING)                                    , BORDER + (WEAPON_Y + SPACING) * 4],
  [47 + (SUMMON_MAIN_X + SPACING)     + (SUMMON_GRID_X + SPACING)    , BORDER + (WEAPON_Y + SPACING) * 4],
  [47 + (SUMMON_MAIN_X + SPACING)                                    , BORDER + (WEAPON_Y + SPACING) * 4 + SUMMON_GRID_Y + SPACING],
  [47 + (SUMMON_MAIN_X + SPACING)     + (SUMMON_GRID_X + SPACING)    , BORDER + (WEAPON_Y + SPACING) * 4 + SUMMON_GRID_Y + SPACING],
  [47 + (SUMMON_MAIN_X + SPACING)     + (SUMMON_GRID_X + SPACING) * 2, BORDER + (WEAPON_Y + SPACING) * 4],
  [47 + (SUMMON_MAIN_X + SPACING) * 2 + (SUMMON_GRID_X + SPACING) * 2, BORDER + (WEAPON_Y + SPACING) * 4],
  [47 + (SUMMON_MAIN_X + SPACING) * 2 + (SUMMON_GRID_X + SPACING) * 2, BORDER + (WEAPON_Y + SPACING) * 4 + SUMMON_GRID_Y + SPACING],
]
TEXT_Y = BORDER + (WEAPON_Y + SPACING) * 4 + (SUMMON_GRID_Y + SPACING) * 2
IMAGE_SIZE = [
  BORDER + (WEAPON_X + SPACING) * 4 + (CHARA_FRONT_X + SPACING) * 2 + CHARA_FRONT_X + BORDER,
  BORDER + (WEAPON_Y + SPACING) * 4 + (SUMMON_GRID_Y + SPACING) * 2 + 16 + BORDER
]

###
def createPartyImage(party_json, updated, class_name, party_id):
  image = Image.new('RGB', IMAGE_SIZE, (24,24,27))

  # Weapons
  if 'weapons' in party_json:
    for index, weapon in enumerate(party_json['weapons']):
      if weapon:
        weapon_path = os.path.join(paths.FRONTEND_IMG_DIR, 'weapon', str(weapon) + '00.jpg')
        if os.path.exists(weapon_path):
          with Image.open(weapon_path) as weapon_image:
            weapon_image = weapon_image.resize(size=[WEAPON_X, WEAPON_Y])
            image.paste(weapon_image, box=WEAPON_POSITIONS[index])

  # Class
  if class_name is not None:
    class_path = os.path.join(paths.FRONTEND_IMG_DIR, 'class', class_name + '.jpg')
    if os.path.exists(class_path):
        with Image.open(class_path) as class_image:
          image.paste(class_image, box=[BORDER, BORDER + WEAPON_Y + SPACING])

  # Characters
  if 'characters' in party_json:
    for index, chara in enumerate(party_json['characters']):
      if chara:
        if index < 3:
          chara_path = os.path.join(paths.FRONTEND_IMG_DIR, 'unit', str(chara) + '000.jpg')
          if os.path.exists(chara_path):
            with Image.open(chara_path) as chara_image:
              image.paste(chara_image, box=CHARA_POSITIONS[index])
        else:
          chara_path = os.path.join(paths.FRONTEND_IMG_DIR, 'unit_small', str(chara) + '000.jpg')
          if os.path.exists(chara_path):
            with Image.open(chara_path) as chara_image:
              chara_image = chara_image.resize(size=[CHARA_BACK_X, CHARA_BACK_Y])
              image.paste(chara_image, box=CHARA_POSITIONS[index])

  # Summons
  if 'summons' in party_json:
    for index, summon in enumerate(party_json['summons']):
      if summon:
        if index == 0 or index == 5:
          summon_path = os.path.join(paths.FRONTEND_IMG_DIR, 'unit', str(summon) + '000.jpg')
          if os.path.exists(summon_path):
            with Image.open(summon_path) as summon_image:
              summon_image = summon_image.resize(size=[SUMMON_MAIN_X, SUMMON_MAIN_Y])
              image.paste(summon_image, box=SUMMON_POSITIONS[index])
        else:
          summon_path = os.path.join(paths.FRONTEND_IMG_DIR, 'unit_small', str(summon) + '000.jpg')
          if os.path.exists(summon_path):
            with Image.open(summon_path) as summon_image:
              summon_image = summon_image.resize(size=[SUMMON_GRID_X, SUMMON_GRID_Y])
              image.paste(summon_image, box=SUMMON_POSITIONS[index])

  # Write text at the bottom
  image_draw = ImageDraw.Draw(image)
  url = "granblue.party/builder?p=" + str(party_id)
  url_width = font.getsize(url)[0]
  image_draw.text((IMAGE_SIZE[0] - url_width - BORDER, TEXT_Y), url, font=font, fill=(255,255,255))

  # Write file
  for old_party in glob.glob(os.path.join(paths.PARTY_DIR, 'party_' + party_id + '.*.jpg')):
    os.remove(old_party)
  filename = 'party_' + party_id + '.' + str(updated) + '.jpg'
  image.save(os.path.join(paths.PARTY_DIR, filename), quality=85, optimize=True)

###
def fetchParty(party_id: str):
  # fetch party details
  dbconfig.getCursor().execute('SELECT partydata, EXTRACT(EPOCH FROM updated::timestamp with time zone)::bigint FROM party WHERE partyid = %s', [party_id])
  result = dbconfig.getCursor().fetchone()
  party_json = None
  updated = None

  if result is not None:
    party_json = result[0]
    updated = result[1]
    if updated is None:
      updated = 0
    class_name = None

    # Class
    if 'classe' in party_json:
      dbconfig.getCursor().execute('SELECT class.nameen AS class FROM class WHERE class.classid = %s', [ party_json['classe'] ])
      class_name = dbconfig.getCursor().fetchone()[0]

  return party_json, updated, class_name

###
def processPartyRequest(id: str):
  party_json, updated, class_name = fetchParty(id)
  if party_json is not None:
    createPartyImage(party_json, updated, class_name, id)
  else:
    print('Unknown party', id)
