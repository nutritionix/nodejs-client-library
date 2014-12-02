'use strict';

require('colors');

var _        = require('lodash');
var util     = require('util');
var bluebird = require('bluebird');
var request  = bluebird.promisify(require('request'));
var DEV_URL  = process.env.DEV_URL;
var NIX_ENV  = process.env.NIX_ENV;
var DEV_MODE = NIX_ENV === 'development';
var PRO_URL  = 'https://api.nutritionix.com';

function stringify(o) {
    return JSON.stringify(o, null, 4);
}

function formatArgs(args) {
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

function parseJsonSafely(o) {
    try {
        return JSON.parse(o);
    } catch (e) {
        return o;
    }
}

function DebugLogger(enabled) {
    return function debugLogger(){
        if (enabled) {
            return console.log.apply(console.log,
                                     formatArgs(arguments));
        } else {
            return void 0;
        }
    };
}

function ApiMap(clientOpts, url, log){

    var credentials = {
        header: {
            'X-APP-ID': clientOpts.appId,
            'X-APP-KEY': clientOpts.appKey
        },
        query: {
            appId: clientOpts.appId,
            appKey: clientOpts.appKey
        }
    };

    var map = {
        v2: {
            search: {
                method: 'POST',
                url: url + '/v2/search',
                headers: credentials.header,
                json: {
                    limit: 10,
                    offset: 0,
                    'search_nutrient':'calories'
                }
            },
            'brand_search': {
                method: 'GET',
                url: url + '/v2/search/brands',
                qs: {}
            },
            autocomplete: {
                method: 'GET',
                url: url + '/v2/autocomplete',
                qs: {}
            }
        }
    };

    function findKeyDeep(paths, obj) {

        if (!Array.isArray(paths)) {
            paths = paths.split('.');
        }

        var key = paths.shift();
        var containsKey = key in obj;

        // exit
        if (containsKey && paths.length === 0) {
            return _.cloneDeep(obj[key]);
        }

        // recurse
        if(containsKey && paths.length > 0){
            return findKeyDeep(paths, obj[key]);
        }

        // assert
        throw new Error('Can\'t find key: \'%s\'');
    }

    function getOptions(path, payload){
        var opts = findKeyDeep(path, map);
        _.assign(opts[payload.key], payload.opts);
        return opts;
    }

    function ApiResponse(results, expectedStatus){

        var resp = results[0];
        var body = parseJsonSafely(results[1]);
        var status = resp.statusCode;
        var statusOk = +status === +expectedStatus;
        this.status = status;
        this.statusOk = statusOk;
        this.body = body;
        this.success = statusOk && body !== null;
        this.request = _.pick(resp.request, ['method',
                                       'headers', 'uri', 'body']);

        if (this.request.body) {
            this.request.body = parseJsonSafely(this.request
                                                    .body.toString());
        }
    }

    function ResponseHandler(expectedStatus) {
        expectedStatus = expectedStatus || 200;

        return function responseHandler(results){

            var apiRes = new ApiResponse(results,
                                         expectedStatus);

            var logColor = apiRes.statusOk ? 'green'
                                           : 'red';

            log('API Status'[logColor], apiRes.status);
            log('API Response'[logColor], stringify(apiRes));

            if (!apiRes.success) {
                throw apiRes;
            }

            return apiRes.body;
        };
    }

    this.ApiRequest = function ApiRequest(path, payloadKey, expectedStatus){
        return function apiRequest(apiOpts) {
            return request(getOptions(path, {
                key: payloadKey,
                opts: apiOpts
            })).then(new ResponseHandler(expectedStatus));
        };
    };
}

function Nutritionix(clientOpts) {

    _.defaults(clientOpts, {
        appId: process.env.NIX_APP_ID,
        appKey: process.env.NIX_APP_ID,
        debug: false,
        version: 'v2'
    });

    var url  = DEV_MODE ? DEV_URL : PRO_URL;
    var log  = new DebugLogger(clientOpts.debug);
    var apiMap = new ApiMap(clientOpts, url, log);

    log('Debugging is enabled');

    return {
        search: new apiMap.ApiRequest('v2.search', 'json'),
        autocomplete: new apiMap.ApiRequest('v2.autocomplete', 'qs'),
        'brand_search': new apiMap.ApiRequest('v2.brand_search', 'qs')
    };
}

// Exposing
// =================
// new Nutritionix({
//     appId: '',
//     appKey: ''
// });

module.exports = Nutritionix;