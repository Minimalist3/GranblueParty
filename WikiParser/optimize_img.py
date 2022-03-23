#!/usr/bin/python3

import os
import shutil
import sys
from timeit import default_timer as timer

from PIL import Image

from config import defines

FRONTEND_SOURCE = os.path.join(os.getcwd(), '..', defines.getConfig('config/config.ini', 'path')['frontend'], 'src', 'img')
FRONTEND_DEST = os.path.join(os.getcwd(), '..', defines.getConfig('config/config.ini', 'path')['frontend'], 'src', 'img_opti')
DATA_DIR = os.path.join(os.getcwd(), 'data')
filesCount = 0
failedCount = 0

# List all files in a subdirectory
def listFiles(subdir):
  global filesCount, failedCount
  sourceDir = os.path.join(FRONTEND_SOURCE, subdir)
  destDir = os.path.join(FRONTEND_DEST, subdir)

  # Create dest directories
  if not os.path.isdir(destDir):
    os.mkdir(destDir)

  for filename in next(os.walk(sourceDir))[2]:
    sourceImg = os.path.join(sourceDir, filename)
    destImg = os.path.join(destDir, filename)

    if filename.endswith(('jpg', 'png')):
      with Image.open(sourceImg) as image:
        image.save(destImg, quality=85, optimize=True)
        filesCount += 1
      # In case the optimization fails, just copy the image
      sourceSize = os.path.getsize(sourceImg)
      destSize = os.path.getsize(destImg)
      if destSize > sourceSize:
        shutil.copy(sourceImg, destImg)
        failedCount += 1
    elif filename.endswith(('gif', 'webp')):
      shutil.copy(sourceImg, destImg)
      filesCount += 1
    elif filename == '.gitignore':
      continue
    else:
      print(destImg)

# List all subdirectories
def listDirectories():
  for directory in next(os.walk(FRONTEND_SOURCE))[1]:
    listFiles(directory)
  listFiles('.')

def main(argv):
  startTime = timer()

  if not os.path.isdir(FRONTEND_SOURCE) or not os.path.isdir(FRONTEND_DEST):
    print("./config/config.ini doesn't contain the [path] section")
    return 1
  if not os.path.isdir(DATA_DIR):
    print("./data does not exist. Wrong working dir?")
    return 1
  
  listDirectories()

  print('Optimized', filesCount, 'files in', timer() - startTime, 'seconds.', failedCount, 'left as-is.')

if __name__ == '__main__':
  main(sys.argv[1:])