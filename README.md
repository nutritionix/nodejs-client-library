Official Nutritionix NodeJS Client
==================================

#### NOTE This is still in beta and the API may change until version 1.0 of this library.

#### NOTE `v1` of the API is currently not yet implemented

### Installation

```shell
npm install nutritionix --save
```


```js
// Require inside your project
var NutritionixClient = require('nutritionix');
var nutritionix = new NutritionixClient({
    appId: 'YOUR_APP_ID',
    appKey: 'YOUR_APP_KEY'
    // debug: true, // defaults to false
});
```

### Get Item By `id` or search `resource_id`

```js
// this will locate an item by its id or by a search `resource_id`
nutritionix.item({ id: 'zgcjnYV' })
    .then(successHandler, errorHandler)
    .catch(uncaughtExceptionHandler);
;
```


### Get Brand By `id`

```js
// this will locate a brand by its id
nutritionix.v1_1.brand({ id: 'bV'})
    .then(successHandler, errorHandler)
    .catch(uncaughtExceptionHandler);
```


### Standard Search

```js
// This will perform a search. The object passed into this function
// can contain all the perameters the API accepts in the `POST /v2/search` endpoint
nutritionix.search.standard({
  q:'salad',
  // use these for paging
  limit: 10,
  offset: 0,
  // controls the basic nutrient returned in search
  search_nutrient: 'calories'
}).then(successHandler, errorHandler)
  .catch(uncaughtExceptionHandler);
```

### Brand Search

```js
// This will perform a search. The object passed into this function
// can contain all the perameters the API accepts in the `GET /v2/search/brands` endpoint
nutritionix.brand_search({
    q: 'just salad',
    limit: 10,
    offset: 0,
    type: 1 // (1:restaurant, 2:cpg, 3:usda/nutritionix) defaults to undefined
}).then(successHandler, errorHandler)
  .catch(uncaughtExceptionHandler);
```

Take a look `tests/index.js` for an end to end usecase for these libraries.