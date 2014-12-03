'use strict';

// initialize
require('colors');
require('lib-loader').load({
    libDir: __dirname+'/lib'
});

// Dependencies
var _        = require('lodash');
var utils    = require('lib-loader').lib.utils;
var ApiMap   = require('lib-loader').lib.ApiMap;

// Constant Globals
var DEV_URL  = process.env.DEV_URL;
var NIX_ENV  = process.env.NIX_ENV;
var DEV_MODE = NIX_ENV === 'development';
var PRO_URL  = 'https://api.nutritionix.com';


function Nutritionix(clientOpts) {

    _.defaults(clientOpts, {
        appId: process.env.NIX_APP_ID,
        appKey: process.env.NIX_APP_ID,
        debug: false,
        version: 'v2'
    });

    var url  = DEV_MODE ? DEV_URL : PRO_URL;
    var log  = new utils.DebugLogger(clientOpts.debug);
    var apiMap = new ApiMap(clientOpts, url, log);

    // you will only see this if its enabled
    log('Debugging is enabled');

    return {
        search: new apiMap.ApiRequest('v2.search', 'json'),
        autocomplete: new apiMap.ApiRequest('v2.autocomplete', 'qs'),
        'brand_search': new apiMap.ApiRequest('v2.brand_search', 'qs'),
        item: new apiMap.ApiRequest('v2.item', 'qs'),
        brand: new apiMap.ApiRequest('v2.brand', 'qs')
    };
}

// Exposing
// =================
// new Nutritionix({
//     appId: '',
//     appKey: ''
// });

module.exports = Nutritionix;