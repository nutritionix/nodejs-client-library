Nutritionix API v2.0 Beta NodeJS Client Library
==================================

#### NOTE This library is still in beta and subject to change.

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

### Execute an autocomplete query

```js
// This will perform a fuzzy autocomplete query and return suggestions
nutritionix.autocomplete({ q: 'chedar che' })
    .then(successHandler, errorHandler)
    .catch(uncaughtExceptionHandler);
```


### Execute a natural search

```js
var ingredients = [
  '1 tbsp sugar',
  '1 red pepper'
];

// ensure you are passing a string with queries delimited by new lines.
nutritionix.natural(ingredients.join('\n'))
    .then(successHandler, errorHandler)
    .catch(uncaughtExceptionHandler);
```

### Get Item By `id` or search `resource_id`

```js
// this will locate an item by its (id, resource_id, or upc)
nutritionix.item({ id: 'zgcjnYV' })
    .then(successHandler, errorHandler)
    .catch(uncaughtExceptionHandler);
;
```


### Get Brand By `id`

```js
// this will locate a brand by its id
nutritionix.brand({ id: 'bV'})
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
