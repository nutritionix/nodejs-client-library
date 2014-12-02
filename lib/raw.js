'use strict';
require('colors');

module.exports = function (request, credentials, stringify, safeParse) {
    return function (opts, callback) {
        console.debug('API Request'.blue, stringify(opts).yellow);

        var optsNotObject = !(opts.qs instanceof Object);
        var optsIsObject  = !optsNotObject;
        var optsDefined   = opts.qs !== void 0 && opts.qs !== null;

        if (optsDefined && optsNotObject) {
            throw new Error('Request QueryString must be object');
        }

        if (optsDefined && optsIsObject) {
            opts.qs.appId = credentials.appId;
            opts.qs.appKey = credentials.appKey;
        }

        if (opts.json instanceof Object) {
            opts.json.appId = credentials.appId;
            opts.json.appKey = credentials.appKey;
        }


        request(opts, function (err, res, data) {

            var hasResp    = res !== void 0 && res !== null;
            var hasError   = err !== void 0 && err !== null;
            var statusCode = hasResp ? res.statusCode : 'no response from server';
            var reqFailed  = hasError || statusCode >= 400;

            if (reqFailed) {
                var error = err || data || new Error('Bad API Response');
                console.debug('statusCode'.red, statusCode.toString().red);
                console.debug(stringify(error).red);
                return callback(error, null);
            }

            var body = safeParse(data);

            if (body === null) {
                return callback(new Error('No JSON Response returned'), null);
            }

            return callback(null, body);
        });
    };
};