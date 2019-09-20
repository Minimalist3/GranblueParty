#!/bin/bash

function download() {
  IFS=$'\n'

  for line in $(cat ${1})
  do
    RES=$(eval $line 2>&1)

    FAILED=$(echo $RES | grep -i "failed\|error")
    NEW=$(echo $RES | grep -i "Saving to")

    if [ ! -z $FAILED ]
    then
        echo "Failed to download $line"
        echo ""
    fi

    if [ ! -z $NEW ]
    then
        echo "New file $line"
        echo ""
    fi
  done

  unset IFS
}

function list_files() {
  for i in $(ls $1/*.images)
  do
    download $i
  done
}

DATADIR=$(pwd)/data
FRONTEND=$(grep "^frontend=" ./config/config.ini | cut -d '=' -f 2)
if [ -z ${FRONTEND} ]
then
  echo "./config/config.ini doesn't contain the [path] section"
  exit 1
fi

cd ../${FRONTEND}/src/img
list_files ${DATADIR}
