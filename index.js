var _        = require('underscore');
var util     = require('util');
var request  = require('request');
var NIX_ENV  = process.env.NIX_ENV;
var DEV_MODE = NIX_ENV === 'dev';
var DEV_URL  = 'http://localhost:3080';
var PRO_URL  = 'https://api.nutritionix.com';

var formatArgs = function(args) {
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
};

var stringify = function (o) {
    return JSON.stringify(o, null, 4);
};

var safeParse = function (o) {
    try {
        return JSON.parse(o);
    } catch (e) {

        if (e.message === 'Unexpected token o') {
            return o
        }

        return null
    }
};

// Expose
module.exports = function (credentials, debug) {

    debug = debug || false;

    if (debug === true) {

        console.debug = function(){
            return console.log.apply(console.log, formatArgs(arguments));
        };

    } else {

        console.debug = function() {
            return void 0
        };

    }

    console.debug('Debugging is enabled');

    // Allow url switching for DEV
    var url  = (DEV_MODE ? DEV_URL : PRO_URL);
    var raw  = require('./lib/raw')(request, credentials, stringify, safeParse);
    var v1_1 = require('./lib/v1_1.js')(raw, url, '/v1_1/');

    var apiLib = {
        v1_1: v1_1,
        url: url,
        raw: raw,
        safeParse: safeParse,
        stringify: stringify,
        formatArgs: formatArgs
    };

    console.debug('API Library'.blue,'\n',apiLib);
    return apiLib;
};