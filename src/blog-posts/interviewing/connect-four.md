---
title: Who Wins Connect Four?
tags: cs fundamentals

date: '2022-10-28'
---

Given a 2d array representing the state of a connect four board, who won?

```javascript
/*

[
  [ x,  x,  x,  x,  x,  x ]
  [ x,  x,  x,  x,  x,  x ]
  [ x,  x,  x,  x,  1,  x ]
  [ x,  x,  x,  1,  1,  x ]
  [ x,  x,  1,  1,  2,  x ]
  [ x,  1,  2,  2,  1,  2 ]
]
*/

const game = [
  ['x', 'x', 'x', 'x', 'x', 'x'],
  ['x', 'x', 'x', 'x', 'x', 'x'],
  ['x', 'x', 'x', 'x', '1', 'x'],
  ['x', 'x', 'x', '1', '1', 'x'],
  ['x', 'x', '1', '1', '2', 'x'],
  ['x', '1', '2', '2', '1', '2'],
];

const findWinner = (board) => {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const player = board[r][c];
      if (player === 'x') continue;
      if (isVerticalWinner(board, [r, c])) return [player, [r, c], 'vertical'];
      if (isHorizontalWinner(board, [r, c]))
        return [player, [r, c], 'horizontal'];
      if (isDiagonalRightWinner(board, [r, c]))
        return [player, [r, c], 'diagonal-right'];
      if (isDiagonalLeftWinner(board, [r, c]))
        return [player, [r, c], 'diagonal-left'];
    }
  }
  return [-1, [-1, -1], 'none'];
};

const isVerticalWinner = (board, [r, c]) => {
  const player = board[r][c];
  return (
    r + 3 <= board.length - 1 &&
    board[r + 1][c] === player &&
    board[r + 2][c] === player &&
    board[r + 3][c] === player
  );
};

const isHorizontalWinner = (board, [r, c]) => {
  const player = board[r][c];
  return (
    c + 3 <= board[r].length - 1 &&
    board[r][c + 1] === player &&
    board[r][c + 2] === player &&
    board[r][c + 3] === player
  );
};

const isDiagonalRightWinner = (board, [r, c]) => {
  const player = board[r][c];
  return (
    r + 3 <= board.length - 1 &&
    c + 3 <= board[r].length - 1 &&
    board[r + 1][c + 1] === player &&
    board[r + 2][c + 2] === player &&
    board[r + 3][c + 3] === player
  );
};

const isDiagonalLeftWinner = (board, [r, c]) => {
  const player = board[r][c];
  return (
    r + 3 <= board.length - 1 &&
    c - 3 >= 0 &&
    board[r + 1][c - 1] === player &&
    board[r + 2][c - 2] === player &&
    board[r + 3][c - 3] === player
  );
};

const [winner, coordinates, direction] = findWinner(game);

console.log('winner', winner, coordinates, direction);
```
