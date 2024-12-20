---
title: Contains Duplicate
tags: cs fundamentals, array

date: '2022-06-20'
---

[Link](https://leetcode.com/problems/contains-duplicate/submissions/)

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function (nums) {
  const map = {};
  for (var i = 0; i < nums.length; i++) {
    if (map[nums[i]]) {
      return true;
    }
    map[nums[i]] = true;
  }
  return false;
};
```
