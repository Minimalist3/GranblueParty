# API
REST API for [granblue.party](https://www.granblue.party) website.

## Requirements
- NodeJS 12

## Installation
To install the necessary modules, run `npm install` in the current folder.

Copy `./src/config.js.template` to `./src/config.js` and edit relevant values.

## Usage
- `npm start` to run in development mode
- `npm run build && npm run serve` to run in production mode
- You can run the previews server from the WikiParser folder. The API server will try to connect to it every second if not found.