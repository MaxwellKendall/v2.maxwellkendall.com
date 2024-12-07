---
title: Data Structure Overview
tags: cs fundamentals

date: '2022-05-31'
---

Data structures introduce performance minimums for specific actions and are often coupled to proven solutions to common programming tasks. Many such data structures occur natively within a given programming language. In JavaScript, the array data type implements or substitutes for the following.

## Common Data Structures

What is a Stack?

> A Stack is a data structure which implements the `"first in, last out"` property; meaning, an item can be inserted and removed, but an item can only be removed after all the items added after it are removed first.
> --- recursion

What is a Queue?

> A Queue is a data structure which implements the `"first in, first out"` property; meaning, an item can be inserted and removed, but an item can only be removed after all the items added before it are removed first.
> -- array

What is a Hashmap?

> A Hashmap (or HashTable) is a data structure which makes use of a hash function to map one "arbitrary data type" to another "arbitrary data type".
> -- map

What is a Hash Function?

> A Hash Function is a pure function which converts data of an arbitrary size to a fixed size. The result of the function is called the hash value.

For example, the Hashmap can be used to map anagrams to one another such that a hash function is used to map each word (arbitrary data type `a`) is
mapped to an array representing the letters in the alphabet used along with their frequency (abitrary data type `b`). This fn is then used to build a
very simple dictionary containing the grouping of anagrams together.

Mutating an Array via index:

```javascript
arr.splice(indexToMutatle, numberToDelete, ...itemsToAppend);
```

Breadth First Search:

```javascript
// first in, first out (queue)
let arr = someSource[someParam];

while (arr.length) {
  // 👇 removing from arr
  const curr = arr.shift();
  // 👇 ending fn
  if (someCondition) return true;
  else {
    arr = arr.concat(someSource[curr.id]);
  }
}
```

Stack in JS

```javascript
// first in, last out (stack)
class Stack {
  constructor() {
    this.items = [];
  }
  peek() {
    return this.items[this.items.length - 1];
  }
  push(item) {
    return this.items.push(item);
  }
  pop() {
    if (this.items.length == 0) return 'Underflow';
    return this.items.pop();
  }
}

var stack = new Stack();
```
