# sort-paths
Sort directory paths in an intuitive way.

<!-- toc -->

- [NOTICE](#notice)
- [Description](#description)
- [Install](#install)
- [Examples](#examples)
- [Documentation](#documentation)
- [TODO](#todo)
- [License](#license)

<!-- tocstop -->

## NOTICE

> :warning: **Stability: 2 - UNSTABLE**

## Description

This module is designed to sort directory paths in a more natural way. Order is determined by:

* **Path depth**  
  Shallower paths come first.
* **Path component types (file or directory)**  
  Files take precedence over directories, e.g. `D:\hello.txt` always comes before `D:\abc\a.jpg`, regardless of alphabetical order.  
* **Lexical comparison**  
  If two path components are of the same type, they are compared lexically, in a case-insensitive fashion.

**Note**: path component type is determined by the trailing separator, e.g.:

| path          | detected types |
| :--           | :--            |
| `/a/b`        | dir, **file**  |
| `/a/b/`       | dir, dir       |
| `D:\cat.jpeg` | dir, file      |
| `D:\music\`   | dir, dir       |

## Install

**Node.js**  
~~`npm i sort-paths --save`~~ *not available yet*  
`var sortPaths = require('sort-paths');`

**Browser**  
Include either the full or minified version from `/browser`, and use `sortPaths()` globally.  
`<script src="path/to/sort-paths.min.js"></script>`

## Examples

```js
sortPaths([
    '/b/cat.png',
    '/b/dog.jpeg',
    '/a/b/e.txt',
    '/b/',
    '/a/x.txt'
]);

/*
    /a/x.txt
    /a/b/e.txt
    /b/
    /b/cat.png
    /b/dog.jpeg
*/
```

...

## Documentation

`sortPaths(paths, dirSeparator)`

| name         | type     | description                  |
| :--          | :--      | :--                          |
| paths        | String[] | Paths to sort.               |
| dirSeparator | String   | One character.               |
| &nbsp;       |          |                              |
| @return      | String[] | Sorted paths.                |
| @throws      | Error    | On incorrect argument types. |

## TODO

* Use natural sort for numeric names (e.g. file1, file2, ...)

## License

MIT
