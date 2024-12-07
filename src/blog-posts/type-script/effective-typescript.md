---
title: Effective TypeScript
tags: public, typescript

date: '2021-06-15'
---

We can rely on the `tsc` to infer types. We can also statically type a variable to be a `Union Type`:

```typescript
type ExampleOfUnionType = string | boolean | number;
```

This gets tricky when you introduce objects. The solution is to utilize `type guards` like the `typeof` and `instanceof` operators. This is the same thing we would do without TypeScript, but not doing it will result in an error.

```typescript
type UserName = string | { name: string };

const logName = (user: UserName) => {
  if (typeof user === 'string') {
    console.log(user);
  } else {
    console.log(user.name);
  }
};

logName('Max');
logName({ name: 'Maxwell Kendall' });
```

Union types are especially useful when defining an `enum`:

```typescript
type ReformedAndConfessionalDenominations = 'PCA' | 'OPC' | 'URC';

// Error:
const firstBaptist: ReformedAndConfessionalDenominations = 'SBC';
```

### Interface Composition for Types

Some peices of a type might be generic enough to abstract into an interface that may be present on multiple types.

Futhermore, interfaces may be composed together to define a type or another interface.

```typescript
interface x extends y {
  test: string;
}
```

### Type Assertion

Use the `as` keyword behind a reference to signal we know what kind of type the thing is.

```typescript
const func = (a: number | string) => {
  // a.toUpperCase() error
  (a as string).toUpperCase();
};
```

### Generic Types

If we're not sure what a type is going to be until invocation, we can use a generic type. This will allow ups to enforce some level of validation while deferring the specifics to invocation time:

```typescript
const getArray = <Item>(item: Item, arr: Item[]): Item[] => {
  return arr.concat(item);
};

// this is good, all strings 👇
getArray('1', ['1']);

// this is bad, mixed types 👇
getArray(1, ['1']);
```

Generics can be constrained via the `extends` keyword like so:

```typescript
interface Test {
  name: string;
}

const getArray = <Item extends Test>(item: Item, arr: Item[]): Item[] => {
  return arr.concat(item);
};

// this is good, all strings 👇
getArray({ name: 'max', age: 12 }, [{ name: 'claire', age: 4 }]);
```

This allows for a bit more definition to our type setting.
