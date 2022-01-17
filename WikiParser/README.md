# WikiParser
Get data from [gbf.wiki](https://gbf.wiki/) \
**Please use these scripts responsibly.** Be mindful of the Wiki bandwidth.

## Requirements
- PostgreSQL 14
- Python 3.8

## Installation
To restore Python modules:
```
pip3 install -r requirements.txt
```
:exclamation: Your distribution might use pip3 instead. Make sure you don't install Python 2 modules by mistake.

Copy `./config/config.ini.template` to `./config/config.ini` and edit relevant values.

The previews server needs the PIL package. Pillow or Pillow-SIMD work as well.

## Usage
- `./database.py --create` to create the dabatase and its tables.
- `./database.py --update` to fill the tables with the data currently in the CSV files.

The images are not included in the repo to avoid copyright claims. If you want to download them:
- `./update_img.sh` to download all the images.

The skill images come from the Wiki. To get them, you need to:
- `./parse.py -d` to fetch fresh data from the Wiki.
- `./parse.py --all` to parse that data and update the DB with it.

The previews server is run by `make_party_preview.py`.