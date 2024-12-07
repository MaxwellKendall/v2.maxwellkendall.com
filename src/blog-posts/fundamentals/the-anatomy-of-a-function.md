---
title: The Anatomy of a Function
tags: public, cs fundamentals
slug: anatomy-of-a-function
date: '2020-04-25'
---

A function is the bread and butter of any program or application. While there are other pieces, the functions which make up a program are ultimately responsible for what makes a program/application executable. Functions are the engine of the program. When I was first learning how to code I was really tripped up by a couple of things related to functions and there is still a lot I can learn!

The purpose of this post is to introduce the distinction of definition and invocation, while introducing some helpful categories and questions along the way. At the end we'll have gone over the parts of a function which make up the whole.

## Function Invocation vs Function Definition

When I was learning to code, I would sometimes assume that defining a function is the same thing as using it. After speaking with some other folks who are learning, this is a common point of confusion. In Modern JavaScript (ES6+), you typically define a function as follows:

```javascript
const myFunction = () => {};
```

In ES5,

```javascript
var myFunction = function () {};
```

When we do this, we make the variable `myFunction` available for use. When defining a function, here are a few categories to keep in mind!

### Inputs (or Parameters)

Functions may or may not have parameters or inputs. When defining a function, a good thing to ask yourself is:

> When I invoke this function, what data from outside the function will be necessary?

### Return

Like with inputs, a function may or may not have a return value. When defining a function, a good thing to ask yourself is:

> When I invoke this function, what kind of data am I creating?

### Body

The body is the place between the `{}`! This is where we take our function inputs and generate our return. When writing the function body, a good thing to ask yourself is:

> How do I make the inputs create the return?

### Name and Signature

The signature is the input and return value of the function. Based on the signature, we give a proper name:

```javascript
const getItemFromArrayOfObjectsWithValue = (arrayOfObjects, key, value) => {
  return arrayOfObjects.find((obj) => {
    return obj[key] === value;
  });
};
```

This function becomes more readable when we name it based on what it actually does. In this case:

- The inputs are (1) an array of objects, (2) a key present on the items in the array, and (3) the value for the given key of one of the objects in the array.
- The return is one of the items in the array

An ordered list:

1. One
2. Two
3. Three

What's clean about this example is we can reasonably infer both the input and return values without going through the complexity found in the body.

Now here is our invocation of `getItemFromArrayOfObjectsWithValue`:

```javascript
const array = [{ name: 'jon' }, { name: 'jane' }];
const jon = getItemFromArrayOfObjectsWithValue(array, 'name', 'jon');
```

## Overview

The distinction between invocation and definition is _fundamental_. When defining a function we know what to do insofar as we know the purpose of its future invocation. When writing functions, I have found it helpful to ask myself these questions. So, there you have it -- the anatomy of a function!
