---
title: Dynamic Programming
tags: public, fundamentals, draft
slug: dynamic-programming
date: '2023-01-04'
---

In many cases it seems thus far dynamic programming refers to recursion. Under this pattern, we break the problem down into sub-problems and optimize for redundant inputs.

# Complexity Estimates

When estimating the complexity of a recursive function, we consider the time and space complexity as follows.

## Time

We can visualize the time complexity as a tree data structure where the initial invocation is seen as the "root node" of the tree.

```shell
     init()
    /      \
  2()      5()
  /   \     /  \
3()   4() 6()  7()
```

This tree represents exponential time complexity where the recursive call is made inside of a loop. In such a case case, the exponent will be the height of the tree and the base will be the maximum number of children for each node.

In this case, then: `O(2^3)`

## Space

Under the hood, the various calls create a stack data-structure, often referred to as the "call stack."

# Memoization

Memoization can be leveraged in a function when you're looking at a problem with duplicate inputs. The key for the memo is typically the argument which is dynamically changing. Basically with a memo we just use a map which is keyed on the input and the value is the return.
