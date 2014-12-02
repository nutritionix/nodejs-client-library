'use strict';

require('colors');

// This contains an object that has credentials
// omitted from source control for obvious reasons
var config = require('./config.testing.js');

var Nutritionix = require('../index');
var nutritionix = new Nutritionix(config);

function logJson(o) {
    console.log(JSON.stringify(o,null,4));
}

function handleError(e) {
    console.error(logJson(e));
}




// GET https://api.nutritionix.com/v1_1/item?upc=52200004265
// nutritionix.v1_1.item({
//     upc: 52200004265
// }, function (err, item) {
//     console.log('Item Callback', sNull(err).red, nutritionix.stringify(item).green);
// });

// // GET https://api.nutritionix.com/v1_1/brand/51db37c3176fe9790a8991f6
// nutritionix.v1_1.brand({
//     id: '51db37c3176fe9790a8991f6'
// }, function (err, brand){
//     console.log('Brand Callback', sNull(err).red, nutritionix.stringify(brand).green);
// });

// // GET https://api.nutritionix.com/v1_1/search/mcdonalds?results=0:1
// nutritionix.v1_1.search.standard({
//     phrase: 'mcdonalds',
//     results: '0:1'
// }, function (err, results){
//     console.log('Standard Search Callback', sNull(err).red, nutritionix.stringify(results).green);
// });

// // POST https://api.nutritionix.com/v1_1/search -d DATA
// nutritionix.v1_1.search.advanced({
//     fields: ['item_name','brand_name'],
//     query: 'mcdonalds',
//     offset:0,
//     limit:1
// }, function (err, results){
//     console.log('Advanced Search Callback', sNull(err).red, nutritionix.stringify(results).green);
// });

nutritionix.search({
    q:'just salad'
})
.then(function (searchResults){
    logJson(searchResults);
    return nutritionix.autocomplete({
        q:'salad'
    });
})
.then(function (autocompleteResults){
    logJson(autocompleteResults);
    return nutritionix.brand_search({
        q: 'burger'
    });
})
.then(function(brandSearchResults){
    logJson(brandSearchResults);
})
.catch(handleError);