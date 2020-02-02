#!/bin/bash
if [ ! -d dist_new ]; then
  echo "[ERROR] dist_new doesn't exists. Aborting"
  exit 1
fi

rm -rf dist_old
mv dist dist_old
mv dist_new dist
echo "Switch complete"