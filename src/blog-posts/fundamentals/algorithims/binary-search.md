---
title: Binary Search Algorithim
tags: fundamentals

date: '2022-05-03'
---

**Problem Statement:** Given a sorted array and a target, find the proper index for it while maintaining all other elements and the initial sort.

The Binary Search algorithim, in as much as I currently understand it, implements the "divide and conquer" strategy. Given an array and a target element,
we find the target (or target index) under the assumption that the array is sorted in some manner that helps us find the target or target index.

The most common example is when the array is an array of integers, sorted in ascending order. With this constraint -- the input array is always sorted in some
manner which we expect -- we traverse the array by comparing the middle element to the target. If the middle is greater than the target, we recursively call the
function with a narrowed array, where the previous middle is the new last entry `arr[0:middle]`. This is considered "moving to the left". Conversely, if the middle
is less than the target, we recursively call the function with a narrow array, where the previous middle is now the first entry: `arr[middle:]`.

**Solution**:

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
const decrementIndex = (i) => {
  return i > 0 ? i - 1 : i;
};

const isInTerminalState = (start, end) => {
  return start === end;
};

const properIndex = (lastValue, target, i) => {
  if (lastValue === target) return i;
  // not i - 1 b/c we are appending to the array and replacing the current index with this new value
  if (lastValue > target) return i;
  return i + 1;
};

var searchInsert = function (nums, target, start = null, end = null) {
  const startIndex = start === null ? 0 : start;
  const endIndex = end === null ? nums.length - 1 : end;
  if (isInTerminalState(startIndex, endIndex)) {
    return properIndex(nums[endIndex], target, endIndex);
  }
  const middleIndex = Math.floor((startIndex + endIndex) / 2);
  if (nums[middleIndex] === target) {
    return middleIndex;
  }
  if (nums[middleIndex] > target) {
    return searchInsert(nums, target, 0, decrementIndex(middleIndex));
  }

  return searchInsert(nums, target, middleIndex + 1, endIndex);
};
```

## Efficency Analysis

The space complexity for this is 0(1). No matter how big the input size, the space is constant.

The time complexity for this is 0(log n). Depending on the size of the input, we use the log of n invocations of our function.

```javascript
/**
 * @param {number[]} nums sorted by asc
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  let l = 0,
    r = nums.length - 1;
  while (l <= r) {
    // r - l = the length of the sub-array we're looking at?
    let m = l + Math.floor((r - l) / 2);
    if (nums[m] === target) return m;
    if (nums[m] > target) {
      r = m - 1;
    } else {
      l = m + 1;
    }
  }
  return -1;
};
```
