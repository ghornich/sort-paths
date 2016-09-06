(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

window.sortPaths = require('./sort-paths.js');

},{"./sort-paths.js":3}],2:[function(require,module,exports){
'use strict';

exports = module.exports = splitRetain;

/**
 * splitRetain
 *
 * @param  {String} string - string to split
 * @param  {String|RegExp} separator
 * @param  {Object|undefined} options
 * @param  {Boolean} options.leadingSeparator - if true, the separator will be the leading character in the split array
 * @return {Array} split text
 * @throws {Error}
 */
function splitRetain(string, separator, options) {
    options = defaults(options, {});
    options.leadingSeparator = defaults(options.leadingSeparator, false);

    assert.type(string, 'string', '`string` is not a string');
    assert(typeof separator === 'string' || separator instanceof RegExp, 'invalid `separator` type');
    assert.type(options, 'object', 'invalid `options` type');
    assert.type(options.leadingSeparator, 'boolean', 'invalid `options.leadingSeparator` type');

    if (string.length === 0) {
        return [''];
    }

    separator = separatorToRegex(separator);

    var tokens = string.split(separator);

    if (tokens.length === 1) {
        return tokens;
    }

    var result = [];

    if (options.leadingSeparator) {
        result.push(tokens.shift());
    }

    while (tokens.length > 0) {
        if (tokens.length === 1) {
            result.push(tokens.shift());
        }
        else {
            result.push(tokens.shift() + tokens.shift());
        }
    }

    if (result[0] === '') {
        result.shift();
    }

    if (result[result.length - 1] === '') {
        result.pop();
    }

    return result;
}

splitRetain['VERSION'] = '1.0.1';

function separatorToRegex(separator) {
    if (separator instanceof RegExp) {
        return separator;
    }

    return new RegExp('(' + escapeRegex(separator) + ')', 'g');
}

function escapeRegex(string) {
    //http://stackoverflow.com/a/9310752/4782902
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

assert.type = function (variable, expectedType, message) {
    if (typeof variable !== expectedType) {
        throw new Error(message);
    }
}

function defaults(optionalData, defaultData) {
    if (optionalData === undefined) {
        return defaultData;
    }
    else {
        return optionalData;
    }
}

},{}],3:[function(require,module,exports){
'use strict';

var splitRetain = require('split-retain');

module.exports = sortPaths;

/**
 * Allows sorting arbitrary items without modifying or copying them
 *
 * @typedef {Object} itemDTO
 *
 * @param {String|Object} item - original item
 * @param {Array} pathTokens - split path tokens. Extracted from `item` using `iteratee` and split using `splitRetain`
 */

function sortPaths(items /* , [iteratee, ] dirSeparator */) {
    assert(arguments.length >= 2, 'too few arguments');
    assert(arguments.length <= 3, 'too many arguments');

    var iteratee, dirSeparator;

    if (arguments.length === 2) {
        iteratee = identity;
        dirSeparator = arguments[1];
    } else {
        iteratee = arguments[1];
        dirSeparator = arguments[2];
    }

    assert(isArray(items), 'items is not an array');
    assert(isFunction(iteratee), 'iteratee is not a function');
    assert(typeof dirSeparator === 'string', 'dirSeparator is not a String');
    assert(dirSeparator.length === 1, 'dirSeparator must be a single character');

    //encapsulate into DTOs
    var itemDTOs = items.map(function (item) {
        var path = iteratee(item);

        assert(typeof path === 'string', 'item or iteratee(item) must be a String');

        return {
            item: item,
            pathTokens: splitRetain(path, dirSeparator)
        };
    });

    //sort DTOs
    itemDTOs.sort(createItemDTOComparator(dirSeparator));

    //decapsulate sorted DTOs and return
    return itemDTOs.map(function (itemDTO) {
        return itemDTO.item;
    });
}

/* publish-tasks:auto-version */
sortPaths.VERSION = '1.1.0';

function createItemDTOComparator(dirSeparator) {
    return function (itemDTOa, itemDTOb) {
        var tokensA = itemDTOa.pathTokens;
        var tokensB = itemDTOb.pathTokens;

        for (var i = 0, len = Math.max(tokensA.length, tokensB.length); i < len; i++) {
            if (!(i in tokensA)) {
                return -1;
            }

            if (!(i in tokensB)) {
                return 1;
            }

            var tokenA = tokensA[i].toLowerCase();
            var tokenB = tokensB[i].toLowerCase();

            if (tokenA === tokenB) {
                continue;
            }

            var isTokenADir = tokenA[tokenA.length - 1] === dirSeparator;
            var isTokenBDir = tokenB[tokenB.length - 1] === dirSeparator;

            if (isTokenADir === isTokenBDir) {
                return tokenA < tokenB ? -1 : 1;
            } else {
                return isTokenADir ? 1 : -1;
            }
        }

        return 0;
    };
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function identity(arg0) {
    return arg0;
}

function isFunction(arg) {
    return Boolean(arg) && Object.prototype.toString.call(arg) === '[object Function]';
}

function isArray(arg) {
    return Boolean(arg) && Object.prototype.toString.call(arg) === '[object Array]';
}

},{"split-retain":2}]},{},[1]);
