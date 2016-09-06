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


function sortPaths(items/* , [iteratee, ] dirSeparator */) {
    assert(arguments.length >= 2, 'too few arguments');
    assert(arguments.length <= 3, 'too many arguments');

    var iteratee, dirSeparator;

    if (arguments.length === 2) {
        iteratee = identity;
        dirSeparator = arguments[1];
    }
    else {
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
    return itemDTOs.map(itemDTO => itemDTO.item);
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
            }
            else {
                return isTokenADir ? 1 : -1;
            }
        }

        return 0;
    }
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
