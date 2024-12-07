---
title: Top K Frequent Elements
tags: cs fundamentals

date: '2022-06-22'
---

[Link](https://leetcode.com/problems/top-k-frequent-elements/)

Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.

Key Observations:

- Time: O(n log n) assuming that sort is good
- Space is 0(n log n)

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function (nums, k) {
  const map = {}; // num: frequency
  for (var i = 0; i < nums.length; i++) {
    map[nums[i]] = map[nums[i]] ? map[nums[i]] + 1 : 1;
  }
  const topFrequentElements = Object.entries(map)
    .sort(([numA, freqA], [numB, freqB]) => freqB - freqA) // sort desc in order of highest frequency
    .slice(0, k)
    .map(([num, freq]) => num);

  return topFrequentElements;
};
```

Linear Time Solution using Bucket Sort:

This solution is better because it implements a linear sort.

Key Observations:

- Time: O(n) assuming that sort is good
- Space is 0(n)
- We can implement a linear sort because we know the freqMatrix will only be at most `length of n`.
- Given this datastructure, we loop over the matrix backwards and stop once

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function (nums, k) {
  const map = {}; // num : frequency
  for (var i = 0; i < nums.length; i++) {
    map[nums[i]] = map[nums[i]] ? map[nums[i]] + 1 : 1;
  }

  // 2d array capturing frequency by index
  const freqMatrix = new Array(nums.length + 1).fill([]);
  Object.entries(map).forEach(([num, freq]) => {
    freqMatrix[freq] = freqMatrix[freq].concat([num]);
  });

  const rtrn = [];
  for (var i = freqMatrix.length; i > -1; i--) {
    if (!freqMatrix[i]) continue;
    for (var j = 0; j < freqMatrix[i].length; j++) {
      rtrn.push(freqMatrix[i][j]);
      if (rtrn.length === k) return rtrn;
    }
  }
};
```

Improvements/changes:

- Use an actual `new Map()` for heap
