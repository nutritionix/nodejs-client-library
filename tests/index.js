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
    logJson(e);
    throw e;
}


nutritionix.search({
    q:'just salad'
})
.then(function (searchResults){
    // logJson(searchResults);
    return nutritionix.item({
        id: searchResults.results[0].resource_id
    });
})
.then(function (item){
    // logJson(item);
    return nutritionix.brand({
        id: item.brand.id
    });
})
.then(function(brand){
    logJson(brand);
})
.catch(handleError);