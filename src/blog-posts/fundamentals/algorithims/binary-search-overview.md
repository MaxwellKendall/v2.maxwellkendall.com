---
title: Binary Search
tags: cs fundamentals
slug: binary-search-overview
date: '2022-05-31'
---

Binary Search is a strategy to find a given "target" element within a sorted array. Binary logic is used to traverse the elements within an increasingly small range of indices until the target is discovered. On each iteration, the range is redefined and the binary logic is applied to the middle element within that range. The middle element is compared with such that based o

Given an array of sorted integers, find the index of a given target:

```javascript
fn([1, 2, 3, 4], 4);
// => 3
```

The solution requires a simple while loop which executes so long as the `base condition` evaluates to true.

```javascript
function firstNotSmaller(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let rtrn = -1;
  while (left <= right) {
    let mid = Math.trunc((right + left) / 2);
    if (arr[mid] >= target) {
      rtrn = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return rtrn;
}
```
