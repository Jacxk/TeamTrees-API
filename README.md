# TeamTrees-API

TeamTrees-API is the un-official API for [TeamTrees.org](https://teamtrees.org/)\
With this package you can get information such as the amount of money donated, recent donations
and see if Treelon (AKA Elon Musk) is #1.

If you haven't donated yet, please do, and share the website. We gotta hit the 20M by 2020.

I donated and I got proof 👀:\
![proof](https://i.imgur.com/PfdZeti.png)

### Usage
You can find the file test [here](https://github.com/Jacxk/TeamTrees-API/blob/master/test.js).

Initialize:
```js
const API = require('./dist/');
const teamTrees = new API.TeamTrees();
```

Methods:
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
```