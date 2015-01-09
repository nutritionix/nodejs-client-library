'use strict';

var _         = require('lodash');
var bluebird  = require('bluebird');
var request   = bluebird.promisify(require('request'));
var utils     = require('./utils.js');
var endpoints = require('./endpoints.js');

function ApiMap(clientOpts, url, log){

    var map = this.map = endpoints({
        header: {
            'X-APP-ID': clientOpts.appId,
            'X-APP-KEY': clientOpts.appKey
        },
        query: {
            appId: clientOpts.appId,
            appKey: clientOpts.appKey
        }
    }, url);

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

        if (typeof payload.opts === 'string') {
            opts[payload.key] = payload.opts;
            return opts;
        }

        _.forEach(payload.opts, function(v,k){
            if (opts.url.match(':'+k) !== null) {
                opts.url = opts.url.replace(':'+k, payload.opts[k]);
                delete payload.opts[k];
            }
        });

        _.assign(opts[payload.key], payload.opts);

        return opts;
    }

    function ApiResponse(results, expectedStatus){

        var resp = results[0];
        var body = utils.parseJsonSafely(results[1]);
        var status = resp.statusCode;
        var statusOk = +status === +expectedStatus;
        this.status = status;
        this.statusOk = statusOk;
        this.body = body;
        this.success = statusOk && body !== null;
        this.request = _.pick(resp.request, ['method',
                                       'headers', 'uri', 'body']);

        if (this.request.body) {
            this.request.body = utils.parseJsonSafely(this.request
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
            log('API Response'[logColor], utils.stringify(apiRes));

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

module.exports = ApiMap;
