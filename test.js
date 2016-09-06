'use strict';

var test = require('tape');
var sortPaths = require('./sort-paths');

test('errors', function (t) {
    t.throws(() => sortPaths([]), /too few arguments/);
    t.throws(() => sortPaths([], (x)=>x, '/', 5), /too many arguments/);
    t.throws(() => sortPaths([], 5, '/'), /iteratee is not a function/);
    t.throws(() => sortPaths(6, '/'), /items is not an array/);
    t.throws(() => sortPaths('/some/path', '/'), /items is not an array/);
    t.throws(() => sortPaths(['/a', '/b']), /too few arguments/);
    t.throws(() => sortPaths(['/a', '/b'], 5), /dirSeparator is not a String/);
    t.throws(() => sortPaths(['/a', '/b'], '//'), /dirSeparator must be a single character/);

    t.end();
});

test('variable arguments', function (t) {
    t.deepEqual(
        sortPaths(['a/b', 'a/', 'a/a/c'], '/'),
        ['a/', 'a/b', 'a/a/c']
    );

    t.deepEqual(
        sortPaths([{ id: 5, path: 'a/b' }, { id: 11, path: 'a/' }, { id: 1, path: 'a/a/c' }], item => item.path, '/'),
        [{ id: 11, path: 'a/' }, { id: 5, path: 'a/b' }, { id: 1, path: 'a/a/c' }]
    );

    t.end();
});

test('unix folders', function (t) {
    var unsorted = [
        '/home/joe/',
        '/var/www/beta-site/core/pages/login.cgi',
        '/home/joe/images/25-11.jpeg',
        '/var/www/test.php',
        '/home/joe/images/',
        '/',
        '/home/joe/quotes.txt',
        '/bin/',
        '/bin/'
    ];

    var expected = [
        '/',
        '/bin/',
        '/bin/',
        '/home/joe/',
        '/home/joe/quotes.txt',
        '/home/joe/images/',
        '/home/joe/images/25-11.jpeg',
        '/var/www/test.php',
        '/var/www/beta-site/core/pages/login.cgi',
    ];

    t.deepEqual(sortPaths(unsorted, '/'), expected);

    t.end();
});

test('windows folders', function (t) {
    var unsorted = [
        'C:\\Users\\Peter\\Documents\\water.jpeg',
        'C:\\Windows\\',
        'C:\\Windows\\notepad.exe',
        'D:\\Music\\Artist\\great song.mp3',
        'D:\\',
        'D:\\Music\\queen.mp3',
        'C:\\Users\\Peter\\Documents\\legal\\petition.docx'
    ];

    var expected = [
        'C:\\Users\\Peter\\Documents\\water.jpeg',
        'C:\\Users\\Peter\\Documents\\legal\\petition.docx',
        'C:\\Windows\\',
        'C:\\Windows\\notepad.exe',
        'D:\\',
        'D:\\Music\\queen.mp3',
        'D:\\Music\\Artist\\great song.mp3'
    ];

    t.deepEqual(sortPaths(unsorted, '\\'), expected);

    t.end();
});

test('incorrect separator', function (t) {
    t.deepEqual(
        sortPaths(['/a/b/c', 'a/a', 'a/z'], '\\'),
        ['/a/b/c', 'a/a', 'a/z']
    );

    t.end();
});

test('edge cases', function (t) {
    t.deepEqual(sortPaths([], '/'), []);
    t.deepEqual(sortPaths(['D:\\a\\b'], '\\'), ['D:\\a\\b']);
    t.deepEqual(sortPaths(['//', '/', '///'], '/'), ['/', '//', '///']);

    t.end();
});
