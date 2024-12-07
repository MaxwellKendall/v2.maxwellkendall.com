---
title: Interviewing Question
tags: cs fundamentals

date: '2024-01-08'
---

```javascript
// #: H1
// ##: H2
// : <p>
// *: <li>
// \n: <br>

// split on \n delmitter --> '# this is a sentence'[]
// prepend special tag based on the first word
// append special tag based on the first word
// If it is a <li> --> prepend two special tags: <ul><li>{word}</li>
const specialChars = ['#', '##', '*'];
const htmlBySpecialChar = {
  '#': (str, lastTag = null) => {
    // insert possibly </ul>
    if (lastTag === '*') {
      return `</ul><h1>${str}</h1>`;
    }
    return `<h1>${str}</h1>`;
  },
  '##': (str, lastTag = null) => {
    // insert possibly </ul>
    if (lastTag === '*') {
      return `</ul><h2>${str}</h2>`;
    }
    if (lastTag === 'p') {
      return `</p><h2>${str}</h2>`;
    }
    return `<h2>${str}</h2>`;
  },
  '*': (str, lastTag = null) => {
    if (lastTag !== '*') {
      return `<li>${str}</li>`;
    } else {
      return `<ul><li>${str}</li>`;
    }
  },
  p: (str, lastTag = null) => {
    if (lastTag === 'p') {
      return `<>${str}`;
    }
    return `<p>${str}`;
  },
};
// "# This is a header\nThis is a paragraph\n* This is a list item\n* Another list item
const convertToHtml = (md) => {
  const lines = md.split('\n');
  const htmlString = [];
  let lastTag = null;
  for (const line of lines) {
    const firstChar = line.split(' ')[0];
    const isPTag = !specialChars.includes(firstChar);
    const currentTag = isPTag ? 'p' : firstChar;
    const render = isPTag
      ? htmlBySpecialChar['p']
      : htmlBySpecialChar[firstChar];
    const html = isPTag
      ? render(line, lastTag)
      : render(line.slice(1), lastTag);
    htmlString.push(html);
    lastTag = currentTag;
  }
  return htmlString.join('');
};

// default
// "# This is a header\nThis is a paragraph\n* This is a list item\n* Another list item"
// "# This is a header\nThis is a paragraph\n* This is a list item\n* Another list item"
const result = convertToHtml(
  '# This is a header\nThis is a paragraph\n* This is a list item\n* Another list item'
);

console.log({ result });

// // with a line break
// "# This is a header\nThis is a paragraph with a\n line break\n* This is a list item\n* Another list item"

// "# This is a header\nParagraph 1\n\nParagraph 2* This is a list item\n* Another list item"
```
