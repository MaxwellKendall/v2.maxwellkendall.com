---
title: TypeScript Tips and Tricks
tags: public, typescript

date: '2021-06-15'
---

Working with types in JavaScript is a lot easier when you have a few tips and tricks
under your belt. This post goes over a few of them. The main theme is the introduction of basic classifications of types.

### Prepended keywords

The `Partial` keyword allows you to specify that a given input or return is of a certain type, but may omit certain properties.

```typescript
type User = {
  name: string;
  email: string;
};

const myUser: Partial<User> = {
  name: 'Max',
};
```

This technique is preferable to defining another type w/ optional properties as the User type may change, in which case we would need to manage it as well as it's optional counterpart.

To acheive the opposite, by making optional types required, we can use the `Required` keyword:

```typescript
type User = {
    name: string,
    email?: string
};

const myUser: Required<User> {
    name: 'max',
    email: 'test@test.com'
};
```

If we need to `white list` certain properties on a type we can use the `Pick` keyword:

```typescript
type User = {
    name: string,
    email: string,
    gender: string,
    age: number
};

type UserPreview = ;

const myUser: Pick<User, "name" | "email"> {
    name: 'max',
    email: 'test@test.com'
};
```

If we need to `black list` certain properties on a type we can use the `Omit` keyword:

```typescript
type User = {
    name: string,
    email: string,
    gender: string,
    age: number
};

const myUser: Omit<User, "gender", "age"> {
    name: 'max',
    email: 'test@test.com'
};
```

### Immutable Variables and Types

Ready only variable:

```typescript
const user = {
  name: 'max',
} as const;

// this will error!
user.name = 'max kendall';
```

Type which enforces readonly variables after they are defined:

```typescript
type User = {
  readonly name: string;
  // readonly favoriteBooks: Readonly<string[]>;
  readonly favoriteBooks: ReadonlyArray<string>;
  readonly education: {
    readonly degree: string;
  };
};

const readOnlyUser: User = {
  name: 'Max',
  favoriteBooks: ['Moby Dick'],
  education: {
    degree: 'Bachelor of Arts',
  },
};
```

### Types with Optional Properties

```typescript
type User = {
  name: string;
  email?: string;
};
```

Since email is optional, we have to account for this when plucking the `email` property:

```typescript
const user: User = {
  name: 'max',
  email: 'test@test.com',
};

// this errors
// const email: string = user.email;

// this works
const email: string = user.email!;
```

(this actually works w/o the `!` in latest TypeScript)

### Inferred Types

```typescript
const user = {
  name: 'John Doe',
  age: 27,
};

type User = typeof user;

const user2: User = {
  age: 28,
  name: 'Jane Doe',
};
```

### Dynamically Typed Strings

```typescript
function handler(eventType: string) {
  console.log(`handling ${eventType}`);
}
```

We want to enforce the prefix `on` as the input so only strings beginning with `on` will pass validation:

```typescript
function handler(eventType: `on${string}`) {
  console.log(`handling ${eventType}`);
}

handler('onClick');
handler('test');
```

Line 6 fails validation, line 5 works.
