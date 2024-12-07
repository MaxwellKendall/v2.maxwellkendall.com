---
title: Recursion
tags: algorithims

date: '2022-09-20'
---

- "base case" is just where there is no recursive call
- help: truncate your imagination to only consider the first iteration of recursive calls
- help: don't use a parameter as a return value, the return acts as a parameter by itself
- help:

## Optimizations:

- `memo`: if a problem can be reduced to redundant subproblems, we can memoize the return by iteratively building an object keyed by the arguments which change and the return as the value. See post on dynamic programming.

## Mental Model

A recursive function creates a stack data structure on which gets items appended on each invocation. We can also vizualize the process using a tree data structure.
