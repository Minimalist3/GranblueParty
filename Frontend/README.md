# Frontend
Vue.js Frontend for [granblue.party](https://www.granblue.party) website.

## Requirements
- NodeJS 10

## Installation
To install the necessary modules, run `npm install` in the current folder.

Copy `./src/js/config.js.template` to `./src/js/config.js` and edit relevant values.

## Usage
- `npm start` to run in development mode
- `npm run build` to build the site for production

## Hosting the site
The website is using Nginx to run in production, but you can use whatever you prefer. Since the frontend is using Vue Router, you will need to modify your server configuration for it to work: https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations