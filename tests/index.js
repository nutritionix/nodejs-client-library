'use strict';

require('colors');

// This contains an object that has credentials
// omitted from source control for obvious reasons
var _ = require('lodash');
var config = require('./config.testing.js');
var Nutritionix = require('../index');
var nutritionix = new Nutritionix(config);

var errMsgs = {
    brand: 'There was a problem looking up a Brand',
    item: 'There was a problem looking up an Item',
    search: 'There was a problem performing a Search',
    auto: 'There was an issue performing an autocomplete search',
    brand_search: 'There was an issue executing a Brand Search',
    natural: 'There was an issue performing a natural search',
    uncaught: 'There was an uncaught exception'
};

function logJson(o) {
    console.log(JSON.stringify(o,null,4));
}

function RequestErrorHandler(msg) {
    return function reqErrHndlr(e) {
        console.error(msg.red);

        if (_.isObject(e) && !(e instanceof Error)) {
            logJson(e);
        } else {
            console.error(e);
        }

        process.exit(1);

    };
}

// ============================================================
// Success handlers
// ============================================================
function autoSuccess(autoResults){
    var q = autoResults[0].text;
    console.log('autocomplete successfull searching items using: %s'.green, q);
    return nutritionix.search({
        q: q
    });
}

function searchSuccess(searchResults){
    var result = searchResults.results[0];
    var id = result.resource_id;

    var name = [
        id,
        result.brand_name,
        result.item_name
    ].join(' - ');

    console.log(('search successfull retrieving '+
                'record for item: %s').green, name);

    return nutritionix.item({
        id: id
    });
}

function itemLookUpSuccess(item){
    var id = item.brand.id;
    console.log('successfully located item, getting brand: %s'.green, id);
    return nutritionix.brand({
        id: item.brand.id
    });
}

function brandLookUpSuccess(brand){
    console.log('successfully located brand: %s'.green, brand.name);
    return nutritionix.brand_search({
        q: brand.name
    });
}




function brandSearchSuccess(bsRes){
    console.log('executed brand search: %d hits'.green, bsRes.total);
    _.forEach(bsRes.results, function(brand){
        console.log(' - %s item_count=%d website=%s'.green, brand.name,
                                                            brand.item_count,
                                                            brand.website);
    });

    var recipe = [
        '1 tbsp sugar',
        '1 red pepper'
    ];

    return nutritionix.natural(recipe.join('\n'));
}


function naturalSearchSuccess(nRes){

    console.log('executed natural search: %d hits'.green, nRes.results.length);

    _.forEach(nRes.results, function(r){

        var query = r.parsed_query.query;
        var calories = _.find(r.nutrients, {attr_id: 208}) || {
            attr_id: null,
            value: null,
            unit: null,
            usda_tag: null
        };

        console.log(' - %s calories=%d'.green, query, calories.value);
    });

}

// ============================================================
// Execute Tests
// ============================================================
var autocompleteQuery = {
    q:'sala' // should autocomplete salad
};

console.log('attempting to autocomplete: %s'.green, autocompleteQuery.q);

// start by autocompleting a phrase
nutritionix.autocomplete(autocompleteQuery)
    // perform an item search using the autocompleted phrase
    .then(autoSuccess,          new RequestErrorHandler(errMsgs.auto))
    // grab the first item id from search and locates its entire record
    .then(searchSuccess,        new RequestErrorHandler(errMsgs.search))
    // when an item is found attempt to locate its brand record
    .then(itemLookUpSuccess,    new RequestErrorHandler(errMsgs.item))
    // log the brand into and end the test without failures
    .then(brandLookUpSuccess,   new RequestErrorHandler(errMsgs.brand))
    // perform a brand search using the brands name
    .then(brandSearchSuccess,   new RequestErrorHandler(errMsgs.brand_search))
    // perform a natural search
    .then(naturalSearchSuccess, new RequestErrorHandler(errMsgs.natural))
    // oops something unexpected happened
    .catch(new RequestErrorHandler(errMsgs.uncaught));