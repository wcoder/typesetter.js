'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
//var replace = require('gulp-replace');
var cssnano = require('gulp-cssnano');

gulp.task('build:css', function () {
    return gulp.src('./src/*.css')
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build:js', function () {
    return gulp.src('src/*.js')
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        //.pipe(replace('setBuffer', 'sB'))
        .pipe(gulp.dest('dist'));
});
