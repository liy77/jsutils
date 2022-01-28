# Util Types

## Example
```js
const T = require("util-types");

const arr = [1, 2, 3, { _id: 23, value: "ABC" }];

T.isIterator(arr.values()) // -> true
T.isNumberArray(arr) // -> false
T.isNumberArray(arr.slice(3)) // -> true
```