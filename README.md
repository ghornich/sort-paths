# sort-paths
Sort directory paths in an intuitive way.

<!-- toc -->

- [Description](#description)
- [Install](#install)
- [Examples](#examples)
- [Documentation](#documentation)
- [TODO](#todo)
- [License](#license)

<!-- tocstop -->

## Description

This module is designed to sort absolute directory paths. Order is determined by:

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
`npm i sort-paths --save`  
`var sortPaths = require('sort-paths');`

**Browser**  
Include either the full or minified version from `/browser`, and use `sortPaths()` globally.  
`<script src="path/to/sort-paths.min.js"></script>`

## Examples

```js
sortPaths(
    [
        '/b/cat.png',
        '/b/dog.jpeg',
        '/a/b/e.txt',
        '/b/',
        '/a/x.txt'
    ],
    '/'
);

/*
    /a/x.txt
    /a/b/e.txt
    /b/
    /b/cat.png
    /b/dog.jpeg
*/
```

—

```js
sortPaths(
    [
        'E:\\',
        'D:\\music\\',
        'D:\\',
        'D:\\music\\song.mp3'
    ],
    '\\'
);

/*
    D:\\
    D:\\music\\
    D:\\music\\song.mp3
    E:\\
*/
```

—

```js
sortPaths(
    [
        { id: 55, path: 'C:/Users/Al/pictures.zip' },
        { id: 2,  path: 'C:/Users/w.dll' },
        { id: 14, path: 'C:/Users/' },
        { id: 30, path: 'C:/Users/Al/' }
    ],
    function (item) { return item.path; },
    '/'
);

/*
    { id: 14, path: 'C:/Users/' }
    { id: 2,  path: 'C:/Users/w.dll' }
    { id: 30, path: 'C:/Users/Al/' }
    { id: 55, path: 'C:/Users/Al/pictures.zip' }
*/
```

## Documentation

`sortPaths(items, [iteratee, ] dirSeparator)`

| name         | type     | description                                                                              |
| :--          | :--      | :--                                                                                      |
| items        | Array<*> | Path strings (or objects) to sort.                                                       |
| [iteratee]   | Function | Optional iteratee, called on each item. Must return a string. Used when sorting objects. |
| dirSeparator | String   | One character.                                                                           |
| &nbsp;       |          |                                                                                          |
| @return      | Array<*> | Sorted items.                                                                            |
| @throws      | Error    | On incorrect argument type/count.                                                        |

## TODO

* Use natural sort for numeric names (e.g. file1, file2, ...), or add a customizable compare function
* Browser tests (e.g. karma), for /browser releases
* Lint

## License

MIT
