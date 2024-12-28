---
title: Dynamic Programming Part I
tags: algorithms, dp
slug: dynamic-programming-pt-i
date: '2024-12-28'
description: Dynamic programming is an optimization where we use cache not only to eliminate redundant computations, but to determine the answer for new inputs.
---

In Dynamic Programming (DP) we use cache not only to eliminate redundant computations, **but to determine the answer for new inputs.** As with any algorithmic pattern, the real test of understanding is by being able to identify the conditions when employing the pattern will achieve the optimal solution -- not by a rote memorization of the pattern itself.

## Properties of a Dynamic Programing Problem

When a given problem possesses the following properties, we should consider employing this pattern.

1. **The answer is trivial for a subset of inputs**

This property applies to a lot of problems. Not all inputs for a given problem are equivalent. Some are trivial and others are very difficult. In such a case, we should consider the plausibility of a dynamic cache.

> Given a cache with answers for input set [x:z], can we determine the answer for input `x1`?

2. **The solution is determined in terms of itself**

This property requires more than just a function calling itself. It requires that the answer to the problem is be expressible as the answer to the same problem with different inputs.

Two of the most common examples of this algorithmic pattern, [the fibonacci sequence](https://leetcode.com/problems/fibonacci-number/description/) and [climbing stairs](https://leetcode.com/problems/climbing-stairs/description/), are perfect illustrations of both of these properties.

## The Fibonacci Sequence

> What is the nth number in the Fibonacci sequence?
> The Fibonacci sequence is defined such that each term (after the first two) is the sum of the previous two terms.

```python
cache = {}
def fibonacci(n: int) -> int:
    if n in cache:
        return cache[n]
    if n <= 1:
        cache[n] = n # (property 1)
        return n
    cache[n] = fibonacci(n - 1) + fibonacci(n - 2) # property (2)
    return cache[n]
```

## Climbing Stairs

> Assuming you can only climb either 1 or 2 steps at a time, how many different ways can you climb a staircase of N steps?

> n = 3: [1,1,1], [1,2], [2,1]

```python
cache = {}
def climb_stairs(n: int) -> int:
    if n in cache:
        return cache[n]
    if n <= 3:
        cache[n] = n # property (1)
        return n
    cache[n] = climb_stairs(n - 1) + climb_stairs(n - 2) # property (2)
    return cache[n]
```

In each of the above examples, we can see the properties above very clearly. First, we know the answer for a trivial subset of inputs; for `fibonacci`, we know the answer for all inputs less than or equal to 1; for `climb_stairs`, we know the answer to all inputs less than or equal to 3. Coming to this conclusion requires little more than observation. It does not require much thought.Second, we express the solution in terms of itself; for `fibonacci`, this only requires observation of the mathematical defintion of the sequence of numbers; for `climbing_stairs`, it requires a bit of logical reflection. To climb `n` stairs, we determine all unique permutations of 1 and 2 which sum to `n` by observing the answer will be the same as the subset of permutations of `n - 1` -- where every individual permutation has a `1 step` appended to it -- ad of `n - 2` -- whever every individual permutation has a `2 step` appended to it.

## Conclusion

The dynamic programming pattern has some beauty to it. We can admire the cleverness at play. Sometimes -- as is the case with the fibonacci sequence -- the dual properties of trivial inputs and recursive solutions are easy to percieve. Othertimes, they are less obvious -- as is the case with `climbing_stairs`.

This pattern gets even more interesting when storage optimizations are applied to the dynamic cache. In such a case, the program evicts the parts of the cache when it is known that they will never be used again.

Please let me know if you found this article useful or if you would like to provide further clarity and corrections by sending me an email at [maxwellnkendall@gmail.com](mailto:maxwellnkendall@gmail.com?subject=Feedback%20on%20Dynamic%20Programming%20Part%20I).
