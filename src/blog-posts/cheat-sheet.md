---
title: Algorithms Cheat Sheet
tags: interviews

date: '2023-05-25'
---

## In Place Sort

```javascript
// sort an array in place in DESC order
const sortDesc = (arr) => {
  let min = 0;
  let max = arr.length - 1;
  while (min <= max) {
    let first = arr[min];
    let last = arr[max];
    // ascending order
    if (first < last) {
      arr[min] = last;
      arr[max] = first;
      max--;
    } else if (last < first) {
      max--;
    } else if (min === max) {
      min++;
      max = arr.length - 1;
    } else {
      min++;
      last--;
    }
  }
};

sortDesc([1, 2, 3, 4]);
// ==> [4, 3, 2, 1]
```

## Find Target in Sorted Array (Binary Search)

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

firstNotSmaller([1, 2, 3, 4], 4);
// => 3
```
