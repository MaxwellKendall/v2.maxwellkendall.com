---
title: Sorting Strategies
tags: cs fundamentals

date: '2022-05-27'
---

Sorting is a good example of an algorithmic task. There are a few basic requirements:

- Stable sort: meaning two items being compared in a list are the same, their sort order is
  maintained.
- In-place: meaning no additional data-structures -- beyond that which is necessary and trivial --
  is used for performing the sort.

# Implementations of a List of Integers in Ascending Order

1. Insertion Sort
   This sort (a) iterates through the list and (b) considers previous items sorted. The current item is
   placed at the index where the immediate previous or left element is smaller than itself.

Time Complexity: O(n^2)

2. Selection Sort
   This sort (a) iterates through the list and (b) finds the smallest item in the unsorted list and puts it at the next index in the sorted list.

Time Complexity: O(n^2)
Also: unstable

3. Bubble Sort
   In this approach, we "bubble up" the larger values from the left side of the array.

```javascript
function sortList(unsortedList) {
  const n = unsortedList.length;
  for (var i = n - 1; i >= 0; i--) {
    let swapped = false;
    for (var j = 0; j < i; j++) {
      if (unsortedList[j] > unsortedList[j + 1]) {
        const temp = unsortedList[j];
        unsortedList[j] = unsortedList[j + 1];
        unsortedList[j + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) return unsortedList;
  }
  return unsortedList;
}
```

Time Complexity: O(n^2)

4. Merge Sort

```javascript
function sortList(unsortedList) {
  const n = unsortedList.length;
  if (n <= 1) return unsortedList;
  const midpoint = Math.floor(n / 2);
  const leftList = sortList(unsortedList.slice(0, midpoint));
  const rightList = sortList(unsortedList.slice(midpoint));
  const res = [];
  let leftPtr = (rightPtr = 0);
  while (leftPtr < midpoint || rightPtr < n - midpoint) {
    if (leftPtr === midpoint) {
      res.push(rightList[rightPtr]);
      rightPtr++;
    } else if (rightPtr === n - midpoint) {
      res.push(leftList[leftPtr]);
      leftPtr++;
    } else if (leftList[leftPtr] <= rightList[rightPtr]) {
      res.push(leftList[leftPtr]);
      leftPtr++;
    } else {
      res.push(rightList[rightPtr]);
      rightPtr++;
    }
  }
  return res;
}
```

So for this guy, we use recursion and build an array for eaech

Time complexity: O(n log(n))
