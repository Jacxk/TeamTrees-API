# TeamTrees-API

[![NPM](https://nodei.co/npm/teamtrees-api.png)](https://www.npmjs.com/package/teamtrees-api)

TeamTrees-API is the un-official API for [TeamTrees.org](https://teamtrees.org/)\
With this package you can get information such as the amount of money donated, recent donations
and see if Treelon (AKA Elon Musk) is #1.

If you haven't donated yet, please do, and share the website. We gotta hit the 20M by 2020.

I donated and I got proof 👀:\
![proof](https://i.imgur.com/PfdZeti.png)

## Usage
You can find the file test [here](https://github.com/Jacxk/TeamTrees-API/blob/master/test.js).\
This package comes with a rate limiter and a cache system so you dont break the website by making 1,000 requests.
You can disable it but I don't recommend it.

### Options:
```js
// they are all optional
{
  rateLimit: true // enable rate limiter
  cache: {
    enable: true, // enable the cache syste,
    duration: 5 // time to hold the data in minutes
  }
}
```

### Initialize:
```js
const {TeamTrees} = require('teamtrees-api');
const teamTrees = new TeamTrees(/* options */);
```

### Methods:
```js
// Get all total donation amount
teamTrees.getTotalTrees(true).then(console.log); // 10,048,199
teamTrees.getTotalTrees(false).then(console.log); // 10048199

// Get the most recent donations
teamTrees.getMostRecent().then(console.log);

/* OutPut
[
  ...
  {
    "name": 'yoy0n',
    "trees": '20',
    "message": 'Giving back to mother earth!',
    "date": 2019-10-31T03:43:14.807Z,
    "img": 'https://teamtrees.org/images/icon-badge-leaf-2.svg'
  }
  ...
]
*/

// Get the top donations (where Elon Musk is)
teamTrees.getMostTrees().then(console.log);

/* OutPut
[
  ...
  {
    "name": 'Elon Musk',
    "trees": '1,000,000',
    "message": 'For Treebeard',
    "date": 2019-10-30T00:00:00.000Z,
    "img": 'https://teamtrees.org/images/icon-badge-earth.svg'
  }
  ...
]
*/

// I suck at naming btw
// Get the days left and trees left
// Thanks to @subgap (https://twitter.com/subgap) for the idea
teamTrees.getLeft().then(console.log)

/* OutPut
{
  "daysLeft": 60,
  "treesLeft": {
    "amount": {
      "fixed": '8,602,253',
      "value": 8602253
    },
    "percent": '56.99'
  }
*/
```