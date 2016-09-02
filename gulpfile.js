'use strict';

var gulp = require('gulp');
var packageJson = require('./package.json');
var version = packageJson.version;
var publishTasks = require('gulp-publish-tasks');

gulp.task('pre-publish', ['update-source-version', 'build-browser-full', 'build-browser-min', 'update-readme-toc']);

gulp.task('update-readme-toc', () => publishTasks.updateMarkdownTOC('README.md'));
gulp.task('update-source-version', () => publishTasks.updateSourceVersion('sort-paths.js', version));
gulp.task('build-browser-full', () => publishTasks.browserify('browser-build-helper.js', 'browser/sort-paths.js'));
gulp.task('build-browser-min', () => publishTasks.browserify('browser-build-helper.js', 'browser/sort-paths.min.js', { minify: true }));
