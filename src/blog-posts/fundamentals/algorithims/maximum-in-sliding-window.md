---
title: Maximum Sliding Window
tags: public, cs fundamentals

date: '2022-05-11'
---

**Problem Statement:** Given an integer array and a window of size w, find the current maximum value in the window as it slides through the entire array.
**Note:** If the window size is greater than the array size, we will consider the entire array as a single window.

This solution prompts us to use the `two pointers` strategy. The real effort here is kind of handled by `Math.max`. It would be nice to show a solution without using this built in from JS.

**Solution**:

```javascript
const findMaxSlidingWindowWithTwoPointers = function (nums, windowSize) {
  let left = 0;
  var result = [];
  while (left <= nums.length - windowSize) {
    const arr = nums.slice(left, left + windowSize);
    result.push(Math.max(...arr));
    left++;
  }
  return result;
};
```

Another way to implement a solution to this problem is by using the `dequeue` data structure. A dequeue structure is designed to traverse an array. It has the following characteristics:

1. 0(1) push and pop operations
2. Sorted in descending order
3. Think of it like a tuple

```javascript
const findMaxSlidingWindowWithDequeue = function (nums, windowSize) {
  const dequeue = [0, windowSize - 1];
  const result = [];
  for (var i = 0; i < nums.length; i++) {}

  return result;
};
```
