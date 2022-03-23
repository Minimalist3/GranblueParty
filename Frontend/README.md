# Frontend
Vue.js Frontend for [granblue.party](https://www.granblue.party) website with Server Side Rendering.

## Requirements
- NodeJS 16

## Installation
To install the necessary modules, run `yarn install` in the current folder.

Copy `./src/js/config.js.template` to `./src/js/config.js` and edit relevant values. \
Copy `./src/js/config-server.js.template` to `./src/js/config-server.js` and edit relevant values.

## Usage
- `npm run build:static` to build static assets

### Development mode
Each instance needs to run for HMR to work. Wait for a command to finish producing its files before running the next one.

- `npm run dev:server`
- `npm run dev:client`
- `npm run nodemon`

### Production
- `npm run build:server`
- `npm run build:client`
- `npm start`

## Hosting the site
The website is using Nginx to run in production, but you can use whatever you prefer. Since the frontend is using Vue Server Side Rendering, it is recommanded to host the Node instance behind a reverse proxy. The default port is 4000.

## Changelog

- 2022-03-10: New design
- 2022-02-08: Forgotten password functionnality
- 2020-02-01: Server Side Rendering
- 2019-12-06: Version 2: new design, using TailwindCSS and Font Awesome.
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