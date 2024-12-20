---
title: Arrays and Hash Maps
tags: cs fundamentals, draft

date: '2022-11-04'
---

You can solve an array problem without a map but often times it comes with a performance penalty. The question really ought to emerge when solving an array problem:

> How could a hashmap improve the efficency of this?

A great example of this is the classic problem `pair product`:

> Write a function, pairProduct, that takes in an array and a target product as arguments. The function should return an array containing a pair of indices whose elements multiply to the given target. The indices returned must be unique.

The simple array implementation is O(n^2):

```javascript
const pairProduct = (numbers, targetProduct) => {
  for (var i = numbers.length - 1; i > 0; i--) {
    const num = numbers[i];
    for (let j in numbers.slice(0, i)) {
      if (num * numbers[j] === targetProduct) return [i, Number(j)];
    }
  }
};
```

The optimized solution uses a clever map which allows us to go down to linear time O(n):

```javascript
const pairProduct = (numbers, targetProduct) => {
  const indexByNumbers = {};
  for (var i = numbers.length - 1; i > 0; i--) {
    const num = numbers[i];
    const complement = targetProduct / num;
    if (indexByNumbers[complement]) {
      return [i, indexByNumbers[complement]];
    }
    indexByNumbers[num] = i;
  }
};
```

This is a perfect example of how a hash map can help us more effeciently solve array problems.

## Hash Map vs Regular Map

The difference is in the key. In JavaScript the `new Map()` constructor allows us to make use of an object whose keys are more complex values. For a hash map there is typically a "hash function" which creates the key for the map from an element in the array.

## Set vs Hashmap vs Regular Map

A set is effectively the same thing as a hash map because it is defined as that which contains
