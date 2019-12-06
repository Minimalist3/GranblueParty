#!/bin/bash
if [ -d dist_new ]; then
  echo "[ERROR] dist_new exists. Aborting"
  exit 1
fi

mv dist dist_new
mv dist_old dist
echo "Rollback complete"