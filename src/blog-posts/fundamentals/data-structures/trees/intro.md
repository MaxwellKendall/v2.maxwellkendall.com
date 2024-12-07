---
title: Trees
tags: cs fundamentals

date: '2022-08-09'
---

A tree is similar to a LinkedList in that each node contains references to other nodes. It is different from a LinkedList in that it may contain a reference to more than one.

> What is a binary tree?
> A tree where each node has two children.

## Traversal Order

A traversal order really only matters if we're on a sorted tree of some kind where each node's children are sorted relative to its parent. This is normally considered a "binary search tree" where the parent is greater than the children and the left child is always greater than the right child. (or something?)

- In Order: left, current, right
- Pre Order: current, left, right
- Post Order: left, right, current

## Traversal Strategies

### Depth First Serach (DFS)

DFS is an algorithim which implements `in-order or post-order traversal` and `backtracking`. We look at the deepest node first, then we back track and look at the other paths on the ancestor nodes. This approach will be suitable for a variety of canonical sorts of problems such as finding the longest path between nodes and so on. The path can be counter intuitive so it's important to be able to visualize this path. As the name suggests, we go as deep as possible from our starting point in one direction and only then do we look at the other paths from that starting point.

### Breadth First Search (BFS)

BFS is an algorithm which implements `pre-order traversal` and is a more intuitive path IMO. In this case we traverse the tree going "one level at a time." This is most suitable for certain problems such as `shortest path between nodes` where we don't want to go down really far in the wrong direction only to find that the starting-node's immediate other neighbor was the terminal node.

#### Code Examples

Inverting a tree:

```javascript
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function (root) {
  if (!root) return null;

  const left = root.left;
  root.left = root.right;
  root.right = left;

  invertTree(root.left);
  invertTree(root.right);

  return root;
};
```

With a LinkedList, the easiest way to traverse is via a `while` loop, whereas in this case it appears the easiest way to traverse is via recursion as the same logic applies to each child.

Within this data structure, this is where Depth First Search (DFS) -- recursive and iterative -- and Breadth First Search (BFS) come into play.

1. DFS with Recursion:

```javascript
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root, depth = 0) {
  let counter = depth;
  if (!root) {
    return counter;
  } else {
    counter++;
  }

  const left = maxDepth(root.left, counter);
  const right = maxDepth(root.right, counter);

  if (left > right) return left;
  return right;
};
```

2. Iterative DFS
   Uses "pre-order" depth first search where we arbitrarily look at the left side first.

```javascript
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
  let stack = [[root, 1]]; // first in last out (this is how js arrays work by default)
  let counter = 0;
  while (stack.length) {
    const [node, depth] = stack.pop();
    node && node.left ? stack.push([node.left, depth + 1]) : null;
    node && node.right ? stack.push([node.right, depth + 1]) : null;

    if (node) {
      counter = Math.max(counter, depth);
    }
  }
  return counter;
};
```

3. BFS
   Benefit of this approach is only that we don't use recursion. Recursion is considered a "stack" because of the "call stack" which it utilizes under the hood. In this case, we end up using a `queue` instead of a stack.

```javascript
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
  let counter = 0;
  let queue = [root];
  while (queue.length) {
    for (var i = 0; i < queue.length; i++) {
      // hacky - remove the first item in array. Like python dequeue.popleft()
      const node = queue[0];
      queue = queue.slice(1);
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    counter++;
  }
  return counter;
};
```

1. Iterative BFS using Reference to `queue.length` to create a for loop

```javascript
const levelAverages = (root) => {
  // bfs, on last iteration, convert to an avg
  const rtrn = [];
  if (!root) return rtrn;
  const queue = [root];
  while (queue.length) {
    const siblingSize = queue.length;
    const siblings = [];
    for (let i = 1; i <= siblingSize; i++) {
      const current = queue.shift();
      siblings.push(current.val);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    console.log('all siblings for level', siblings);
    rtrn.push(siblings.reduce((acc, val) => acc + val, 0) / siblingSize);
  }
  return rtrn;
};
```

2. Recursive or Iterative DFS using accumulator array where `arr[i]` contains siblings for level `i`

```javascript
const levelAverages = (root) => {
  const rtrn = [];
  if (!root) return rtrn;

  const stack = [ [root, 0] ];
  while (stack.length) {
    const [node, level] = stack.pop();
    if (rtrn[level]) rtrn[level].push(node.val);
    else rtrn[level] = [node.val];

    if (node.right) stack.push([node.right, level + 1]);
    if (node.left) stack.push([node.left, level + 1]);
  }

  return rtrn
    .map((arr) => {
      return arr.reduce((acc, val) => acc + val, 0) / arr.length
  })
}

recursive:
const levelAverages = (root) => {
  if (!root) return [];
  const siblings = [];
  populateSiblings(root, 0, siblings);
  return siblings
    .map((arr) => {
      return arr.reduce((acc, val) => acc + val, 0) / arr.length
  })
}

const populateSiblings = (node, level, rtrn) => {
  if (!node) return rtrn;
  if (rtrn[level]) rtrn[level].push(node.val);
  else rtrn[level] = [node.val];

  if (node.right) populateSiblings(node.right, level + 1, rtrn);
  if (node.left) populateSiblings(node.left, level + 1, rtrn);
};
```

## Traversing all Paths in a Tree

This is counter-intuitive to me because I am so accustomed to not mutating values.
