'use strict';

var util     = require('util');

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

module.exports = {
    stringify: stringify,
    formatArgs: formatArgs,
    parseJsonSafely: parseJsonSafely,
    DebugLogger: DebugLogger
};

