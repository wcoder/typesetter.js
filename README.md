# typesetter.js
Simple and extensible typesetter.

[Demo](https://wcoder.github.io/typesetter.js/index.html)

## Install

```
npm i typesetter.js
```

## Features

- Realistic Key Processing Engine
- Self-contained: Requires zero dependencies to work
- Detecting typos

### Options:

Name | Type | Description
-----|------|-------------
data | string | text content for display
maxErrorsCount | int | limit errors (disable: 0)
cursorAutoShift | bool | skip whitespaces
skipComments | bool | skip comments for `cursorAutoShift`
skipEmptyLines | bool | skip empty lines for `cursorAutoShift`

#### Example
```js
typesetter(element, {
    data: "function hashKey(obj) { return 1; }",
    maxErrorsCount: 5,
    cursorAutoShift: true,   // ignore whitespace
    skipComments: true,      // additional setup for cursorAutoShift
});
```

Developed just for fun. Inspired by the idea of https://typing.io/

---
&copy; 2015 Yauheni Pakala | Apache License 2.0
