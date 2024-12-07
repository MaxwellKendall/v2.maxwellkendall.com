---
title: Basic Algorithims - Sorting
tags: cs fundamentals

date: '2022-05-27'
---

Time Complexity Examples:

```javascript
for (var i = 0; i < n; i++) {
  let minIndex = i;
  for (var j = i; j < n; j++) {
    if (unsortedList[j] < unsortedList[minIndex]) {
      minIndex = j;
    }
  }
}
```

This is O(n \* (n - 1) / 2) which is reducible to O(n^2).

Nested Loop w/ inner Loop doing j + 1 look ups:

```javascript
for (var i = n - 1; i >= 0; i--) {
    let swapped = false;
    for (var j = 0; j < i; j++) {
        if (unsortedList[j] > unsortedList[j + 1]) {
            const temp = unsortedList[j];
            // this will always be ok! 👇
            unsortedList[j] = unsortedList[j + 1];
            unsortedList[j + 1] = temp;
            swapped = true;
        }
    }
```
