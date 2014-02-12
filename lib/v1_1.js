module.exports = function (raw, url, endpoint) {
    return {
        item: function (query, callback) {
            raw({
                method: 'GET',
                url: url+endpoint+'item',
                qs: query
            }, callback);
        },
        brand: function (query, callback) {
            raw({
                method: 'GET',
                url: url+endpoint+'brand/'+query.id,
                qs: query
            }, callback);
        },
        search: {
            standard: function (query, callback) {
                raw({
                    method: 'GET',
                    url: url+endpoint+'search/'+query.phrase,
                    qs: query
                }, callback);
            },
            advanced: function (query, callback) {
                raw({
                    method: 'POST',
                    url: url+endpoint+'search',
                    json: query
                }, callback);
            },
            brand: function (query, callback) {
                raw({
                    method: 'GET',
                    url: url+endpoint+'brand/search',
                    qs: query
                }, callback);
            }
        }
    }
};