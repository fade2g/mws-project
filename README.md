# Mobile Web Specialist Certification Course

#### _Three Stage Course Material Project - Restaurant Reviews - Stage 2_

## <a name="API_TOKEN"></a>**IMPORTANT** Using API Token from Map Box
This app uses webpack for the buld process. In order to include an API_TOKEN for accessing mapbox, please follow these instructions:
The repository does not contain the API token for mapbox. In order to use mapbox, the following procedure must the followed:
1. Create an API token, if not done already
1. Replace the placeholder string content in the file `src/shared/api_token/api_token.sample.js` with the API token
1. Rename the file `api_token.sample.js` to `api_token.js`

## Installation

The project consist of two components (a data server component and the front end) and is designed to be run and used on the dev machine. The stage 2 project implements the front end. As data source for the bacend, the original Udacity server backend for stage 2 will be used in it's original configurations. As general prerequsites, the platform needs to have a properly configured nodejs installation.

1. Getting and running the backend 
   1. Clone the repository [API Server](https://github.com/udacity/mws-restaurant-stage-2)
   1. Follow the instructions in that projects `README.md`
      * As a quick start: run `npm install`and then `npm i sails -g` to install the dependencies
      * Then `node server` to start the back end server.
      * The server shuld be running on localhost with port 1337
1. Getting and running the front end (the stage 2 project)
   1. Clone this repository
   1. Add / update the API_TOKEn for mapbox (see [Using API Token](#API_TOKEN)
   1. Install the dependencies with `npm install`
   1. Run the dev server
      * `npm run server`: This will run the dev server and serve the files minified
      * `npm run server:dev`: This will run the dev server in development mode (i.e. do not minify, serve sourcemaps es well)
      * The frontend will be served on http://localhost:8080
1. Creating a "real" build:
   * The dev server does not generate the application files on the file system but only on memory. For a distributrtion build run `npm run build` (for production build) or `npm run build:dev` for the development build
1. SSL:
   * PWA should be served with SSL.
   * webpack dev-server is capable of serving with SSL. You can use `npm run serve:ssl`. The front end will be served under [http**s**://localhost:8080](https://localhost:8080)
   * Chrome is not happy with self signed SSL for localhost and will prevent the serviceworker script from being loaded
   * Currently, there is no solution implemented so far

## Stage 2 Project: Feature Validation
In addtion to the features of the stage 1 implementation (see branch [stage-1-complete](https://github.com/fade2g/mws-project/tree/stage-1-complete) of this repository), stage 2 has a focus on PWA and offline capabilities. Mainly:
* Install service worker to intercept fetch request to achieve the optimizations below
* Cache crucial assets
* Cache retrieved data from backend request and images retrieved from single entries
* Through measures above, the app is exected to still function, when goind offline
* Bring performance to a good level
* Introduce a process

### Testing the Feautres
* Service worker
   * You can find the service worker installed in the developer toos
   * After using the app, there will be two caches and a index DB with the resources data
* Offline capabilities:
  * Go to the page of a single resturant http://localhost:8080/restaurant.html?id=1
  * Clear all web app data throigh dev tools
  * Refresh the page
     * Now, the service worker is installed and the crucial assets are added to the cache
  * In the networks tab, go to offline and refresh the page
     * The page should still look the same way
     * The map itself is not cached (hence empty)
  * Go to the main page
     * It will show 1 single restaurant
  * Set the network setting to soemthing slow, disable offline
  * Refresh the page
     * Initially, there will be only 1 restaurant, but after a while, multiple restaurant will be shown

## Additional Notes

### Note about ES6
Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write.