'use strict';

var test = require('tape');
var sortPaths = require('./sort-paths');

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
    ];

    var expected = [
        '/',
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

//TODO test incorrect separator, errors, empty list, 1 item list
