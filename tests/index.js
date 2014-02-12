require('colors');
var async = require('async');

// This contains an object that has credentials
// omitted from source control for obvious reasons
var config = require('./config.testing.js');

var nutritionix = require('../index')({
    appId: config.appId,
    appKey: config.appKey
}, true);


var sNull = function(n) {
    if (n === null) {
        return 'null';
    }

    return n;
};


// GET https://api.nutritionix.com/v1_1/item?upc=52200004265
nutritionix.v1_1.item({
    upc: 52200004265
}, function (err, item) {
    console.log('Item Callback', sNull(err).red, nutritionix.stringify(item).green);
});

// GET https://api.nutritionix.com/v1_1/brand/51db37c3176fe9790a8991f6
nutritionix.v1_1.brand({
    id: '51db37c3176fe9790a8991f6'
}, function (err, brand){
    console.log('Brand Callback', sNull(err).red, nutritionix.stringify(brand).green);
});

// GET https://api.nutritionix.com/v1_1/search/mcdonalds?results=0:1
nutritionix.v1_1.search.standard({
    phrase: 'mcdonalds',
    results: '0:1'
}, function (err, results){
    console.log('Standard Search Callback', sNull(err).red, nutritionix.stringify(results).green);
});

// POST https://api.nutritionix.com/v1_1/search -d DATA
nutritionix.v1_1.search.advanced({
    fields: ['item_name','brand_name'],
    query: 'mcdonalds',
    offset:0,
    limit:1
}, function (err, results){
    console.log('Advanced Search Callback', sNull(err).red, nutritionix.stringify(results).green);
});

// GET https://api.nutritionix.com/v1_1/brand/search?query=just+salad&auto=true&type=1&min_score=1&appId=c7a8b9cd&appKey=8e54cb1c548d4470701cfdddc8883a57
nutritionix.v1_1.search.brand({
    query:'just salad',
    auto:true,
    type:1,
    min_score:1
}, function (err, results){
    console.log('Brand Search Callback', sNull(err).red, nutritionix.stringify(results).green);
});