---
title: Group Anagrams
tags: cs fundamentals, array

date: '2022-06-22'
---

[Link](https://leetcode.com/problems/group-anagrams/)

Given an array of strings strs, group the anagrams together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

Key Observations:

- using a `hash fnunction` to generate a unique key representing the letter
- constraint for letters is based on length of the alphabet

```javascript
/**
 * @param {string[]} strs
 * @return {string[][]}
 */

var groupAnagrams = function (strs) {
  const map = {};
  strs.forEach((w) => {
    // hashKeyForWord is a key representing the # of letters in the word
    const hashKeyForWord = w.split('').reduce((acc, l) => {
      const index = l.charCodeAt() - 'a'.charCodeAt();
      acc[index] = acc[index] + 1;
      return acc;
    }, new Array(26).fill(0));

    map[hashKeyForWord] = map[hashKeyForWord]
      ? map[hashKeyForWord].concat(w)
      : [w];
  });
  return Object.values(map);
};
```
