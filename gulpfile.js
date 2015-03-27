'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    livereload = require('gulp-livereload'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    browserify = require('gulp-browserify'),
    webserver = require('gulp-webserver'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    imagemin = require('gulp-imagemin');


var pathsDev = {
  css: {
    src: 'app/less/*.less',
    watch: 'app/less/**/*.less',
    dist: 'dist/styles/',
    _public: '_public/styles/'
  },

  js: {
    src: 'app/scripts/**/*.js',
    dist: 'dist/scripts/',
    _public: '_public/scripts/'
  },

  img: {
    src: 'app/images/**/*',
    _public: '_public/images/'
  }

}

// Define o que fazer em cada ambiente.
var environment = {
    compressing: false,
    _public: false,
    _dev: true
  }



// Compila o lESS e da o minify.
gulp.task('less', function() {
  gulp.src(pathsDev.css.src)
    .pipe(less())
    .pipe(gulpif(environment.compressing, minifyCSS()))
    .pipe(gulpif(environment._public, rev()))
    .pipe(gulpif(environment._public, gulp.dest(pathsDev.css._public), gulp.dest(pathsDev.css.dist)))
    .pipe(rev.manifest() )
    .pipe(gulp.dest('rev/css'))
    .pipe(gulpif(environment._dev, livereload()));
});



// Faz o Bundle dos módulos com BROWSERFY
// Faz o minify do JS
gulp.task('scripts', function() {
  gulp.src('app/scripts/app.js')
    .pipe(browserify())
    .pipe(gulpif(environment.compressing, uglify()))
    .pipe(rename('app.js'))
    .pipe(gulpif(environment._public, rev()))
    .pipe(gulpif(environment._public, gulp.dest(pathsDev.js._public), gulp.dest(pathsDev.js.dist)))
    .pipe(rev.manifest() )
    .pipe(gulp.dest('rev/js'))
    .pipe(gulpif(environment._dev, livereload()));
});


// Compress images.
gulp.task('images', function () {
  gulp.src(pathsDev.img.src)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest(pathsDev.img._public));
});



// JSHINT
gulp.task('lint', function() {
  gulp.src(pathsDev.js.src)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});



// Server Dev
gulp.task('serverDev', function() {
  gulp.src('dist')
    .pipe(webserver({
      port: 8080,
      fallback: 'index.html',
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('dev', ['less', 'scripts', 'lint', 'serverDev'], function () {
  gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist/'));

  gulp.src('app/images/**/*')
    .pipe(gulp.dest('dist/images/'));
});



// Server Public
gulp.task('serverPublic', function() {
  gulp.src('_public')
    .pipe(webserver({
      port: 8000,
      fallback: 'index.html',
      directoryListing: false,
      open: true
    }));
});

gulp.task('configPublic', function () {
  environment.compressing = true;
  environment._public = true;
  environment._dev = false;
});

//Clean
gulp.task('cleanStyle', function () {
  gulp.src('_public/styles/*.css')
    .pipe(clean());
});

gulp.task('cleanScripts', function () {
  gulp.src('_public/scripts/*.js')
    .pipe(clean());
});
gulp.task('clean', ['cleanStyle', 'cleanScripts']);

// Publica CSS e JS já com Hash e minificado.
gulp.task('public', ['clean', 'configPublic', 'less', 'scripts', 'lint']);

// Publica as Views com as chamadas do CSS e JS com o hash correto e minificadas.
// OBS: Primeiro rodar a task "public" para gerar o JSON com a lista de hashs, depois rodar a task "build".
gulp.task('build', ['images', 'serverPublic'], function(){
  gulp.src(['rev/**/*.json', 'app/**/*.html'])
    .pipe(revCollector())
    .pipe(gulp.dest('_public/'));
});



// Default
gulp.task('default', ['dev'], function() {
  livereload.listen();

  gulp.watch(pathsDev.css.watch, ['less']);
  gulp.watch(pathsDev.js.src, ['scripts', 'lint']);
});