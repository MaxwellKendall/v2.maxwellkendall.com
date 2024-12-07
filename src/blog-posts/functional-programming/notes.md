---
title: Binary Search Algorithim
# tags: public, cs fundamentals
tags: functional-programming

date: '2022-05-03'
---

# Chapters 1 & 2: Distinctions and Terms

Procedures vs Functions: former, functionality; latter, input/output
Arguments vs Parameters: former, values; latter, references

- the `call-site` (invocation time) takes `arguments`; the `define-site` (definition time) takes `parameters`
- js allows passing more arguments than parmaters
  Arity: number of arguments
- there is a length property to functions. Weird. It's readonly.
  Variadic Fn: one whose arity is variable

```javascript
// this scares me
var arr = [2];
foo(1, ...arr, 3, ...[4, 5]);
```

Variadic fn with params using destructuring:

```javascript
foo([x,y, ...args]) {
    // ..
}
```

How to access arguments not in the parameters (who cares?)

```javascript
...args
```

Always return something: Functions taken in a mathmatical sense

- Early returns and control flow sometimes implies logic rather than clearly expressing it

Unreturned outputs, Implict Outputs, or Side-effects 😱
IE

```javascript
var y;
const fn = (x) => {
  y = x + 2;
};
// versus
const fn2 = (x) => {
  return x + 2;
};
```

Pass by reference and side-effects

- JS does pass by reference for arrays and objects, so if you update an object/array that's an argument, it's changed 😱
  IE

```javascript
var fn = (list) => {
  var total = 0;
  for (var i = 0; i < list.length; i++) {
    if (!list[i]) list[i] = 0;
    total += list[i];
  }
  return total;
};
var nums = [1, 2, 3, 4, , 6];
```

- 👆 We just mutated nums.

High Order Functions or Functions that return a function or take a fn as a param

- IE forEach
  IE

```javascript
var foo = (fn) => {
  return (msg) => {
    return msg.toUpperCase();
  };
};
foo('yoooo'); // YOOOO
```

IE

```javascript
var foo = (fn) => {
  return bar((msg) => {
    return msg.toUpperCase();
  });
};
var bar = (func) => {
  return func('yoooooo');
};
foo(); // YOOOO
```

Lexical and Execution Scope: Function Behavior while inside another Function's Scope
Closure: When the inner function makes reference to a variable from the outter functions scope

> Closure is when a function remembers and accesses variables from outside of its own scope, even when that function is executed in a different scope
> IE

```javascript
var foo = (msg) => {
  var fn = () => {
    return msg.toUpperCase();
  };
  return msg;
};
var sayYo = foo('yo');
sayYo(); // YOOOO
```

👆 You remembered bro!!! (YO)

> The access that closure enables is not restricted to merely reading the variable's original value - it's not just a snapshot but rather _a live link_. You can update the value, and that new current state remains remembered
> until the next access
> Usefulness of closure:
> If you have an operation that needs to inputs, one of which you know now but the other will be specified later, you can use closure to remember the first input.
