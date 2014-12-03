'use strict';
module.exports = function (credentials, url) {
    return {
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
            },
            item: {
                method: 'GET',
                url: url + '/v2/item/:id',
                qs: {}
            },
            brand: {
                method: 'GET',
                url: url + '/v2/brand/:id',
                qs: {}
            }
        }
    };
};