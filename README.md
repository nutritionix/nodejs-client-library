Official Nutritionix NodeJS Client
==================================

#### NOTE This is still in beta and the API may change until version 1.0
#### NOTE `v1` of the API is currently not yet implemented

### Installation

```shell
npm install nutritionix --save
```


```js
// Require inside your project
var nutritionix = require('nutritionix')({
    appId: 'YOUR_APP_ID',
    appKey: 'YOUR_APP_KEY'
}, false);

// Second argument false can be changed to true
// This will tell the library to enter debugging mode
// and log additional data to the console
```

### UPC Scan

```js
// GET https://api.nutritionix.com/v1_1/item?upc=52200004265
nutritionix.v1_1.item({
    upc: 52200004265
}, function (err, item) {
    // ...
});
```

### Get Item by id

```js
// GET https://api.nutritionix.com/v1_1/item?upc=52200004265
nutritionix.v1_1.item({
    id: '5284ebc52504590000003f4a'
}, function (err, item) {
    // ...
});
```

### Get Brand By ID

```js
// GET https://api.nutritionix.com/v1_1/brand/51db37c3176fe9790a8991f6
nutritionix.v1_1.brand({
    id: '51db37c3176fe9790a8991f6'
}, function (err, brand){
    // ...
});
```


### Standard Search

```js
// GET https://api.nutritionix.com/v1_1/search/mcdonalds?results=0:1
nutritionix.v1_1.search.standard({
    phrase: 'mcdonalds',
    results: '0:1'
}, function (err, results){
    // ...
});
```

### NXQL Advanced Search

```js
// POST https://api.nutritionix.com/v1_1/search -d DATA
nutritionix.v1_1.search.advanced({
    fields: ['item_name','brand_name'],
    query: 'mcdonalds',
    offset:0,
    limit:1
}, function (err, results){
    // ...
});
```

### Brand Search

```js
// GET https://api.nutritionix.com/v1_1/brand/search?query=just+salad&auto=true&type=1&min_score=1
nutritionix.v1_1.search.brand({
    query:'just salad',
    auto:true,
    type:1,
    min_score:1
}, function (err, results){
    // ...
});
```

#### Special thanks
Thank you to [picsoung][1] for allowing us to take over the npm package and inspiring us to create an official nodejs client.

[1]:https://www.npmjs.org/~picsoung