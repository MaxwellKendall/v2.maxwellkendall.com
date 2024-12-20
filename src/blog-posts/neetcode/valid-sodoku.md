---
title: Valid Sodoku
tags: cs fundamentals, array

date: '2022-07-29'
---

[LC](https://leetcode.com/problems/valid-sudoku/)

Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:

Each row must contain the digits 1-9 without repetition.
Each column must contain the digits 1-9 without repetition.
Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.
Note:

A Sudoku board (partially filled) could be valid but is not necessarily solvable.
Only the filled cells need to be validated according to the mentioned rules.

My implementation using arrays:

```javascript
const isOneThruNine = (row) => {
  return row
    .filter((str) => str !== '.')
    .reduce(
      (acc, str) => {
        if (acc.data.has(str)) {
          return { ...acc, isValid: false };
        }
        acc.data.add(str);
        return acc;
      },
      { isValid: true, data: new Set() }
    ).isValid;
};

const columnStartByIndex = [0, 3, 6];
const columnEndByIndex = [3, 6, 10];

var isValidSudoku = function (board) {
  // 2d array [[],[],[], ..]
  // inner and outer array's length is 9
  //     1. check outer array (row)
  //     2. check outer array for each index
  //     3. check each 3x3:
  //      - indecies [:3], [3:6], [7:] for thruple
  for (var i = 0; i <= 8; i++) {
    const row = board[i];
    const column = board.map((b) => b[i]);
    const isRowValid = isOneThruNine(row);
    const isColumnValid = isOneThruNine(column);
    let isThreeByThreeValid = true;
    if (i === 0 || i === 3 || i === 6) {
      const threeByThree = [];
      const rows = board.filter((_, j) => j >= i).slice(0, 3);
      for (var j = 0; j <= 2; j++) {
        const columnStart = columnStartByIndex[j];
        const columnEnd = columnEndByIndex[j];
        let arr = [];
        rows.forEach((r) => {
          const matrix = r.slice(columnStart, columnEnd);
          arr = arr.concat(matrix);
        });
        threeByThree.push(arr);
      }
      console.log(i, threeByThree);
      isThreeByThreeValid = threeByThree.every((arr) => isOneThruNine(arr));
    }
    if (!isRowValid || !isColumnValid || !isThreeByThreeValid) return false;
  }
  return true;
};
```

Using a HashSet:

```javascript
/**
 * @param {character[][]} board
 * @return {boolean}
 */

const hashFn = (r, c) => {
  return `${Math.floor(r / 3)}, ${Math.floor(c / 3)}`;
};

const updateHashSet = (map, key, value) => {
  if (map.has(key)) {
    map.get(key).add(value);
  } else {
    map.set(key, new Set([value]));
  }
};

var isValidSudoku = function (board) {
  const rows = new Map();
  const cols = new Map();
  const squares = new Map();
  for (var r = 0; r <= 8; r++) {
    for (var c = 0; c <= 8; c++) {
      if (board[r][c] === '.') {
        continue;
      }
      if (
        (rows.get(r) && rows.get(r).has(board[r][c])) ||
        (cols.get(c) && cols.get(c).has(board[r][c])) ||
        (squares.get(hashFn(r, c)) &&
          squares.get(hashFn(r, c)).has(board[r][c]))
      ) {
        return false;
      }
      updateHashSet(rows, r, board[r][c]);
      updateHashSet(cols, c, board[r][c]);
      updateHashSet(squares, hashFn(r, c), board[r][c]);
    }
  }
  return true;
};
```

The primary insight above is that we can infer the square for a given coordinate using the `hashFn`.
