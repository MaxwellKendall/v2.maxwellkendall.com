---
title: Linked List Data Structure
tags: draft, fundamentals
date: '2022-05-24'
---

A LinkedList (LL) is an ordered data structure. The end of the list is "the tail" and the start is "the head." How does a LL compare to an array?
First, some terminology differences:

> Elements of an array vs Nodes of a LL
> Indexes of an array vs Positions of a LL

More substantial, arrays are stored "contiguously" in memory. This means all elements are "right next to each other" in the computer's memory. This has consequences in the runtime. For instance, if you want to insert a value into an index, the steps needed are:

1. Check the array can increase one index in size
2. Shift all elements to the right -- or greater than -- the index for the insertion
3. Add the value to the proper index

In worst case, the insertion operation at step 2 could be O(n) because we could be inserting at position 0.

## Insertion Operation Efficiency

Nodes in a LL are not "contiguous" in memory. They can exist anywhere in the space of our computer's memory addressing. The consequence is that we do not need to do any shifting during an insertion operation. Instead, when creating a new node in a LL, we simply (a) create a new node with the "next pointer" going to the proper node and (b) update the "next pointer" of the node at the proper position going to the new node; for instance, if we want to add a node to position 2, we would create new node with a `next pointer` going to the node at position 3 and update the next pointer for the node at position 1.

This means that insertion for LL is O(1) because we don't have to shift "every node" greater than the target position.

## Traversal

1. Use `current` as mutable variable
2. Update `current` to `current.next`
3. Once `current` is `null`, we stop the traversal as we are at the tail

## Linked List Class

```javascript
class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

const a = new Node('A');
const b = new Node('B');
const c = new Node('C');
const d = new Node('D');

a.next = b;
b.next = c;
c.next = d;

// A -> B -> C -> D -> NULL

const printLinedList = (head) => {
  let current = head;

  while (current) {
    console.log(current.val);
    current = current.next;
  }
};
```

## Reverse a Linked List

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
  let ll = head;
  let llReversed = null;
  while (ll) {
    let next = ll.next; // keep the actual next node
    ll.next = llReversed; // Assigning the previous node as the next one
    llReversed = ll; // set to mutated ll
    ll = next; // look at the next node
  }
  return llReversed;
};
```

The key to understanding this implementation is line 17 and 18. Here, we mutate `ll` in order that we can use that value to mutatle `llReversed`. Then, on line 19, we mutate `ll` again to what we need in order to traverse `head`.

The reason this works is because on line 17 and 18, JavaScript is mutating the variable `by value` rather than `by reference`.

## Merge a linkedList:

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */

const nullNode = { val: 0, next: null };

var mergeTwoLists = function (list1, list2) {
  let list3 = nullNode;
  while (list1 && list2) {
    if (list1.val >= list2.val) {
      list3.next = list2;
      list2 = list2.next;
    } else {
      list3.next = list1;
      list1 = list1.next;
    }
    list3 = list3.next;
  }
  list3.next = list1 || list2;
  // b/c JS is pass by reference on line 15, we are able to do this.
  return nullNode.next;
};
```

## Writing/Creating a LinkedList

To incrementally write a linkedlist, you have to
