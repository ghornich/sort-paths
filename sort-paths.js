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

    var tokenizedPaths = paths.map((path) => splitRetain(path, dirSeparator));

    tokenizedPaths.sort(getPathTokensComparator(dirSeparator));

    return tokenizedPaths.map((pathTokens) => pathTokens.join(''));
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
            }
            else {
                return isTokenADir ? 1 : -1;
            }
        }

        return 0;
    }
}

function lastChar(string) {
    return string[string.length - 1];
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

