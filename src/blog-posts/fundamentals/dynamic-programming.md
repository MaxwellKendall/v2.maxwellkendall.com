---
title: Dynamic Programming Introduction
tags: public, fundamentals
slug: dynamic-programming
date: '2023-01-04'
---

## What is dynamic programming?

Dynamic programming (DP) is an important optimization technique used in recursive algorithms. The adjective `dynamic` refers to the cache which is used not only to eliminate redundant computations, but to infer the return value of new inputs from the known return values of previous inputs.

## When to use dynamic programing

It is trivial to memorize and understand a general algorithmic pattern. The real test of understanding is detecting when a given problem's optimal solution requires a specific algorithmic pattern such as DP.

Problems whose optimal solution can be achieved through DP possess the following properties.

1. They can be reduced to a decision tree
   Certain problems can be reduced into a single recurring decision across a series of inputs. We can define the conditions for the decision's result and define the inputs as parameters. This is often referred to as identifying "the subproblem."
2. The problem is easier to answer in a specific order
   For example, perhaps it is very difficult to answer the question with some arbitrary input, however, what if we knew the answer to the input - 1? Would that make it any easier?

## Canonical Problems and their Solution

Two of the most common examples of this algorithmic pattern
are [climbing stairs](https://leetcode.com/problems/climbing-stairs/description/) and defining [the fibonacci sequence](https://leetcode.com/problems/fibonacci-number/description/).

### Climbing Stairs and Fiboancci

> You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

```python
memo = {}
def climb_stairs(n: int) -> int:
    if n in memo:
        return memo[n]
    if n <= 3:
        memo[n] = n
        return n
    memo[n] = climb_stairs(n - 1) + climb_stairs(n - 2)
    return memo[n]
```

Nearly exact same function can be used to generate the nth number in the fibonacci sequence as well since

> The Fibonacci sequence is defined such that each term (after the first two) is the sum of the previous two terms.

The only difference is the base case is changed from `n <= 3` to `n <= 1`

```python
memo = {}
def fibonacci(n: int) -> int:
    print(f"fibonacci({n})")
    if n in memo:
        return memo[n]
    if n <= 1:
        memo[n] = n
        return n
    memo[n] = fibonacci(n - 1) + fibonacci(n - 2)
    return memo[n]

```
