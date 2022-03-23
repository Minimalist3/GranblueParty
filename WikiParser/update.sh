#!/bin/sh
./parse.py -d
./parse.py --all
./database.py --dump