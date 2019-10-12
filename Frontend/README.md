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

## Changelog

- 2019-08-30: Wide layout for Party Builder. The Details tab hides an experimental damage calculator
- 2019-08-11: Support for Skill Keys and Perpetuity Rings added in Party Builder.
- 2019-08-06: Save and load parties with your account. No need for PermaURL anymore!
- 2019-07-26: Drag and drop support in Party Builder
- 2019-07-22: New feature: Share Friend Summons
- 2019-07-17: New feature: Guild Wars tokens calculator
- 2019-07-16: New feature: bookmarklet to load a GBF party to the party builder
- 2019-07-12: New feature: release schedule. Unit titles now link to the wiki
- 2019-07-11: Collection tracker can show SR and R characters. Click the first star to toggle it
- 2019-06-25: New filter for collection, by draw origin
- 2019-06-14: New features: Accounts and Collection
- 2019-05-21: Display weapon skills
- 2019-05-17: Display uncap stars. They aren't saved in the PermaURL yet