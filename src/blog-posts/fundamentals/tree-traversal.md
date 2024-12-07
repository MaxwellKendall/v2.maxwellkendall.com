---
title: Tree Traversal
tags: public, fundamentals
date: '2022-08-19'
---

When navigating a tree, there are two general paths available: Depth First Search (DFS) and Breadth First Search (BFS). When using DFS, we start from the leaves of the tree and make our way toward the root. Conversely, when using BFS, we terminate our search on the leaves of the tree and look at every sibling node on each level before moving along. DFS and BFS each make use of distinct data structures to manage the program state in such a way that each node is visited in the proper order. Knowing how to traverse this complex data structure requires both a clear vision of the intended path and a sound understanding of the underlying data structures used to chart the way.

## DFS: A Counter Intuitive Path

In both paths we start at the root of the tree. In DFS it is said we "start from the leaves of the tree" because once we reach the leaf level, we have only begun our journey through the nodes. There are two basic steps to this path. First, we make our way to the leaves of the tree. From there, we move onto our second step which is to "backtrack" toward the root again.

When taking this path through a binary tree, there are three orders of traversal which emerge: in-order, pre-order, and post-order. A path is said to be "in order" when it looks at the left node first, root node second, and right node third. This can be shortened to `left-root-right` (LRR). With this understood, we can infer pre-order as `root-left-right` (RLR) and post-order as the reverse of pre-prorder, `right-left-root` (RRL).

It is difficult (at least for me) to conceive of this path at the tree level. When working with trees, it is very important to be able to visualize the path as a whole (DFS vs BFS) and the order within that path (LRR, RLR, RLR). Once you have this "birds eye view" and been able to visualize the traversal path and ordering, when implementing DFS (especially via recursion as seen below), we should reduce the cognitive load from the entire tree to a single subtree (perhaps with only leaves as children for further simplicity!).

### Examples

```javascript
const inOrderRecursive = (root) => {
  // append left subtree to of the stack
  if (root.leftChild) {
    inOrderRecursive(root.leftChild);
  }

  // print current node
  console.log(`Current node: ${root.val}`);

  // append right subtree to the top of the stack
  if (root.rightChild) {
    inOrderRecursive(root.rightChild);
  }
};

const inOrderIterative = (root) => {
  const stack = [];

  while (root || stack.length) {
    if (root) {
      stack.push(root);
      root = root.left;
      continue;
    }
    const node = stack.pop();
    if (node.right) {
      stack.push(node.right);
    }
    console.log(`Current node: ${node.val}`);
  }
};
const recursivePreOrder = (root) => {
  // print root node
  console.log(root.val);

  // print all nodes in left subtree
  if (root.leftChild) {
    recursivePreOrder(root.leftChild);
  }

  // print all nodes in right subtree
  if (root.rightChild) {
    recursivePreOrder(root.rightChild);
  }
};

const iterativePreOrder = (root) => {
  const stack = [];
  stack.push(root);
  while (stack.length) {
    const next = stack.pop();
    console.log(`Current Node: ${next.val}`);
    if (next.left) {
      stack.push(next.left);
    }
    if (next.right) {
      stack.push(next.right);
    }
  }
};

const postOrderRecursive = (root) => {
  // print all nodes in right subtree
  if (root.rightChild) {
    postOrderRecursive(root.rightChild);
  }

  // print all nodes in left subtree
  if (root.leftChild) {
    postOrderRecursive(root.leftChild);
  }

  // print root node
  console.log(root.val);
};

const postOrderIterative = (root) => {
  const stack = [];

  while (root || stack.length) {
    if (root) {
      // append the entire right subtree to the stack + root node
      stack.push(root);
      root = root.right;
      continue;
    }
    const node = stack.pop();
    if (node.left) {
      stack.push(node.left);
    }
    console.log(`Current node: ${node.val}`);
  }
};
```

### Usage of the Stack Data Structure

Whether we are implementing a recursive or iterative DFS, we are making use of the `stack` data structure. What's distinctive about the behavior of a stack is that when you read/remove a node from it, **you always read the last one that was added**. As you can observe above, when we drill down to a leaf-node during step one the `stack` is populated with only one side of the tree. The trick is that before each subsequent iteration, we push to the stack the sibling node which was ignored during step one. This means on the next iteration, we read the node's sibling.

## BFS: A More Intuitive Approach

When conceiving of the entire tree, the BFS path makes more sense to me for at least three reasons; first, because with this path we straightforwardly start from the root node and move downward toward the leaves; second, it is not recursively implemented; third, the possible order of visitation is binary -- either `right-to-left` or `left-to-right` -- rather than tertiary (pre, post, or in order). For these reasons, when looking at an entire tree, it is relatively easy to enumerate the node path that will be taken. There still exists the classifications of ordering as acknowledged above, but these are -- at least in my judgment -- easier to understand as well.

### Examples

```javascript
let inOrderTraversal = function (root) {
  var result = '';
  const queue = [];
  queue.push(root);

  while (queue.length) {
    // shift, pop the first item in the array
    const next = queue.shift();
    result += next.val + ' ';
    if (next.left) {
      queue.push(next.left);
    }
    if (next.right) {
      queue.push(next.right);
    }
  }
  return result;
};
```

### Usage of the Queue Data Structure

The queue data structure behaves in the opposite manner as the stack. When reading from a stack, you have to pick the last item appended. Conversely, when reading from a queue, you have to pick the first item appended. While iterating through the tree, we add the children to the queue and they are processed in the order we added them. So when we add `queue.push(node.left/node.right)` the left node is processed first, then the right node.

## Trade-offs

The intuitiveness of one approach over the other is somewhat subjective. Personally, when I invision traversing through a tree, BFS is far more intuitive. For others, the opposite is true. When it comes to objective comparison between one approach over the other, the following observations are relevant.

1. BFS Efficency corresponds to the width of the tree
2. BFS Efficency is highest at the leaves
3. DFS Efficency corresponds to the height of the tree

To understand the above, we have to grasp the dimensions of a binary tree. First, the width of the tree is the greatest number of siblings at a given level and height is the longest path from the root. So whether to
use one or the other is dependent mostly upon: (a) dimensions of the tree and (b) whether the purpose of traversal is more likely to end near the root or at the leaves. If we're dealing with a very wide tree, we should likely use DFS. If we're likely to terminate on the leaves, we should likely use BFS.

In either case, the worst case of traversal is O(n) where n is the number of nodes in the tree.

## Conclusion

Once again, trees are difficult to understand! Overall, the two competing strategies are very different. BFS means going through the tree each level at a time. DFS means going through the tree "subtree-by-subtree", beginning at the root, going to the leaves, and working our way backwards. To gain a sound understanding of this data structure, the first step is to visualize the traversal path for each strategy and substrategy (pre, post, or in order); second, to understand the underlying data structures used to manage state during traversal; third, and perhaps most difficult, to understand the tradeoffs between the various approaches and when to use one over the other.
