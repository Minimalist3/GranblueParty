import glob
import os

from config import dbconfig
from preview import paths

from PIL import Image, ImageDraw, ImageFont

###
def fetchFriendSums(user_id):
  dbconfig.getCursor().execute('SELECT friendSummonsData, gbfId, EXTRACT(EPOCH FROM updated::timestamp with time zone)::bigint AS updated FROM FriendSummons WHERE userid = %s', [user_id])
  result = dbconfig.getCursor().fetchone()
  friendsum_json = None
  friendsum_id = None
  updated = None

  if result != None:
    friendsum_json = result[0]
    friendsum_id = result[1]
    updated = result[2]

  return friendsum_json, friendsum_id, updated

SUMMON_WIDTH = 94
SUMMON_HEIGHT = 196
SUMMON_COLS = 7
SUMMON_ROWS = 2
TEXT_HEIGHT = 25
STAR_SIZE = 22
font = ImageFont.truetype('NotoSans-Regular.ttf', 18)
star_b = Image.open('star_b.png')
star_y = Image.open('star_y.png')

###
def createFriendSumImage(friendsum_json, friendsum_id, updated, user_id):
  image = Image.new('RGBA', [SUMMON_WIDTH * SUMMON_COLS, SUMMON_HEIGHT * SUMMON_ROWS + TEXT_HEIGHT], (24,24,27))
  i = 0

  # Add summon images
  for index in [0, 3, 2, 1, 4, 5, 6, 8, 11, 10, 9, 12, 13, 7]:
    summon = friendsum_json[index]
    if summon:
      summon_path = os.path.join(paths.UNITS_DIR, str(summon['id']) + '000.jpg')
      if os.path.exists(summon_path):
        with Image.open(summon_path) as summon_image:
          image.paste(summon_image.crop([2, 2, SUMMON_WIDTH + 2, SUMMON_HEIGHT + 2]), box=[SUMMON_WIDTH * (i % SUMMON_COLS), SUMMON_HEIGHT * int(i / SUMMON_COLS)])

          # Add stars
          for j in range(1, summon['uncap'] + 1):
            star = None
            if j < 4:
              star = star_y
            else:
              star = star_b
            image.alpha_composite(star, dest=(SUMMON_WIDTH * (i % SUMMON_COLS), SUMMON_HEIGHT * int(i / SUMMON_COLS + 1) - STAR_SIZE * j))

    i += 1

  # Write text at the bottom
  image_draw = ImageDraw.Draw(image)
  image_draw.text((0, SUMMON_HEIGHT * SUMMON_ROWS), "User ID: " + str(friendsum_id), font=font, fill=(255,255,255))
  url = "granblue.party/friendsum/" + str(user_id)
  url_width = font.getsize(url)[0]
  image_draw.text((SUMMON_WIDTH * SUMMON_COLS - url_width, SUMMON_HEIGHT * SUMMON_ROWS), url, font=font, fill=(255,255,255))

  # Write file
  for old_image in glob.glob(os.path.join(paths.FRIENDSUM_DIR, 'friendsum_' + user_id + '.*.jpg')):
    os.remove(old_image)
  filename = 'friendsum_' + user_id + '.' + str(updated) + '.jpg'
  image = image.convert(mode="RGB")
  image.save(os.path.join(paths.FRIENDSUM_DIR, filename), quality=85, optimize=True)

###
def processFriendSumRequest(user_id):
  friendsum_json, friendsum_id, updated = fetchFriendSums(user_id)
  if friendsum_json is not None:
    createFriendSumImage(friendsum_json, friendsum_id, updated, user_id)
  else:
    print('Unknown User id', user_id)