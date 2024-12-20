---
title: Two Sum
tags: cs fundamentals, array

date: '2022-06-22'
---

[Link](https://leetcode.com/problems/two-sum/submissions/)

NOTES:

- Solution uses a HashMap to achieve O(1) look up.
- Use math to determine needed value
- HashMap is keyed on value to index

Problem Statement:
Given an array and a target integer, return the indecies of the two elements which sum to the target. Assuming the array has exactly one solution.

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  const map = {}; // val: index
  for (var i = 0; i < nums.length; i++) {
    const n = nums[i];
    const diff = String(target - n);
    if (map[diff] !== undefined) {
      return [map[diff], i];
    }
    map[n] = i;
  }
};
```
