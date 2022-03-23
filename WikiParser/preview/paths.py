import os

from config import defines

PREVIEWS_DIR = defines.getConfig('config/config.ini', 'path')['previews']
FRONTEND_IMG_DIR = os.path.join(os.getcwd(), '..', defines.getConfig('config/config.ini', 'path')['frontend'], 'src', 'img_opti')
PARTY_DIR = os.path.join(PREVIEWS_DIR, 'party')
FRIENDSUM_DIR = os.path.join(PREVIEWS_DIR, 'friendsum')
UNITS_DIR = os.path.join(PREVIEWS_DIR, 'unit_battle')