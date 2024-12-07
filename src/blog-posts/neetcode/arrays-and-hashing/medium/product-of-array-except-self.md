---
title: Product of Array Except Self
tags: cs fundamentals

date: '2022-06-28'
---

[Link](https://leetcode.com/problems/product-of-array-except-self/)

Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operation.

Key Observations:

- Time & Space: close to O(n^2) --> O(n log n)

```javascript
var productExceptSelf = function (nums) {
  return nums.map((n, i) => {
    const before = nums.slice(0, i);
    const after = nums.slice(i + 1);
    return before.concat(after).reduce((acc, x) => {
      if (acc === null) return x;
      return acc * x;
    }, null);
  });
};

var productExceptSelf = function (nums) {
  return nums.map((n, i) => {
    const allButN = nums.filter((x, ind) => ind !== i);
    return allButN.reduce((acc, x) => {
      if (acc === null) return x;
      return acc * x;
    }, null);
  });
};
```

👆👆👆 This works, but it is not in keeping with the O(n) constraint.

Here is the solution that actually works:

```javascript
var productExceptSelf = function (nums) {
  const arr = [];
  let prefix = 1;
  let postfix = 1;

  for (let i = 0; i < nums.length; i++) {
    arr.push(prefix);
    prefix = prefix * nums[i];
  }
  for (let i = nums.length - 1; i > -1; i--) {
    arr[i] = arr[i] * postfix;
    postfix = postfix * nums[i];
  }
  return arr;
};
```

Notes:

- On the first loop, we (a) populate the current index with the "prefix" -- or, product of all preceding elements -- and (b) update the prefix for the next iteration.
- On the backwards loop, we (a) mutate the current index with the current value (prefix) times the "postfix" -- or, the product of all subsequent elements -- and then update the postfix for the next iteration.
