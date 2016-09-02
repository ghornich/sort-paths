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
 * [sortPaths description]
 * @param  {[type]} paths        [description]
 * @param  {[type]} dirSeparator [description]
 * @return {[type]}              [description]
 */
function sortPaths(paths, dirSeparator) {
    assert(paths && 'length' in paths, 'paths is not an array');
    assert(typeof dirSeparator === 'string', 'dirSeparator is missing or not a String');
    assert(dirSeparator.length === 1, 'dirSeparator must be a single character');

    var tokenizedPaths = paths.map(function (path) {
        return splitRetain(path, dirSeparator);
    });

    tokenizedPaths.sort(getPathTokensComparator(dirSeparator));

    return tokenizedPaths.map(function (pathTokens) {
        return pathTokens.join('');
    });
}

/* publish-tasks:auto-version */
sortPaths.VERSION = '1.0.0';

//sortPaths.comparator //TODO export comparator?

function getPathTokensComparator(dirSeparator) {
    return function (tokensA, tokensB) {
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

            var isTokenADir = lastChar(tokenA) === dirSeparator;
            var isTokenBDir = lastChar(tokenB) === dirSeparator;

            if (isTokenADir === isTokenBDir) {
                return tokenA < tokenB ? -1 : 1;
            } else {
                return isTokenADir ? 1 : -1;
            }
        }

        return 0;
    };
}

function lastChar(string) {
    return string[string.length - 1];
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

},{"split-retain":2}]},{},[1]);
