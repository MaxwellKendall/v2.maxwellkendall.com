---
title: Depth First Search
tags: algorithims

date: '2022-08-12'
---

DFS to get the "diamater" of a binary tree where "diameter" refers to the longest path between any two nodes.

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var diameterOfBinaryTree = function (root) {
  let diameter = 0;
  if (!root) return diameter;

  const longestPath = (treeNode) => {
    if (!treeNode) return 0;

    const leftPath = longestPath(treeNode.left);
    const rightPath = longestPath(treeNode.right);

    // update diameter if greater than current longest
    diameter = Math.max(diameter, leftPath + rightPath);

    // + 1 to increment each non-null return
    return Math.max(leftPath, rightPath) + 1;
  };

  longestPath(root);
  return diameter;
};
```

The DFS strategy requires O(n) runtime and space. Space is taken up by the recursion.
