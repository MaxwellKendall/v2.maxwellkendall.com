---
title: Encode/Decode Strings
tags: cs fundamentals

date: '2022-07-30'
---

[Link](https://leetcode.com/problems/group-anagrams/)

Given an array of strings strs, group the anagrams together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

Key Observations:

- using a `hash fnunction` to generate a unique key representing the letter
- constraint for letters is based on length of the alphabet

```javascript
/**
 * Encodes a list of strings to a single string.
 *
 * @param {string[]} strs
 * @return {string}
 */

const hashFn = (char) => {
  if (char === '') return '';
  return `${char.charCodeAt()}`;
};

const unhashFn = (num) => {
  if (num === '') return '';
  return String.fromCharCode(parseInt(num, 10));
};

var encode = function (strs) {
  const rtrn = strs.map((str) => str.split('').map(hashFn).join(' ')).join(','); // delimiter for words is .
  return rtrn;
};

/**
 * Decodes a single string to a list of strings.
 *
 * @param {string} s
 * @return {string[]}
 */
var decode = function (s) {
  const rtrn = s.split(',').map((str) => {
    const rtrn = str.split(' ').map(unhashFn).join('');
    return rtrn;
  });
  console.log('decode', rtrn);
  return rtrn;
};

/**
 * Your functions will be called as such:
 * decode(encode(strs));
 */
```
