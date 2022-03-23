#!/usr/bin/python3

import glob
import os
import requests
import sys

from config import defines

FRONTEND_DIR = os.path.join(os.getcwd(), '..', defines.getConfig('config/config.ini', 'path')['frontend'], 'src', 'img')
DATA_DIR = os.path.join(os.getcwd(), 'data')
PREVIEWS_DIR = defines.getConfig('config/config.ini', 'path')['previews']

def list_image_files():
  return glob.glob(os.path.join(DATA_DIR, '*.images'))

def list_preview_files():
  return glob.glob(os.path.join(DATA_DIR, '*.preview'))

def download(file, root_dest):
  with open(file, "r", encoding='utf8') as read_file:
    # Parse each line of the .images file
    for line in read_file.read().splitlines():
      [url, dest] = line.split('\t')
      dest = os.path.realpath(os.path.join(root_dest, dest))
      # Only download new files
      if not os.path.isfile(dest):
        print("New file " + dest)
        response = requests.get(url)
        if response.ok:
          with open(dest, "wb") as image_file:
            image_file.write(response.content)
        else:
          print("Failed to download " + url)

def main(argv):
  if not os.path.isdir(FRONTEND_DIR):
    print("./config/config.ini doesn't contain the [path] section")
    return 1
  if not os.path.isdir(DATA_DIR):
    print("./data does not exist. Wrong working dir?")
    return 1
  if not os.path.isdir(PREVIEWS_DIR):
    print("Previews dir does not exist. Missing config line?")
    return 1
  if not os.path.isdir(os.path.join(PREVIEWS_DIR, 'unit_battle')):
    os.mkdir(os.path.join(PREVIEWS_DIR, 'unit_battle'))

  for file in list_image_files():
    download(file, FRONTEND_DIR)

  for file in list_preview_files():
    download(file, PREVIEWS_DIR)

if __name__ == '__main__':
  main(sys.argv[1:])