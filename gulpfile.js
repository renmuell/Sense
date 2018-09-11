var gulp       = require('gulp');
var uglify     = require('gulp-uglify');
var eslint     = require('gulp-eslint');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('gulp-browserify');
var tape       = require('gulp-tape');
var jade       = require('gulp-jade');
var less       = require('gulp-less');

// path

var path = {
  src : {
    js       : 'src/js/**/*.js',
    dev_vendor: 'src/vendors_dev/**/*.*',
    test     : 'test/**/*.js',
    jade     : 'src/jade/*.jade',
    media    : 'src/media/**/*.*',
    vendors  : 'src/vendors/**/*.*',
    less     : 'src/less/*.less'
  },
  build : {
    src      : 'build/js',
    mainJs   : 'build/js/sense.js',
    dev_vendor : 'build/vendors_dev',
    test     : 'build/test',
    root     : 'build',
    media    : 'build/media',
    vendors  : 'build/vendors',
    css      : 'build/css' 
  },
  doc: {
    release : 'docs/release',
    release_src: 'release/**/*.js'
  },
  release : {
    main    : 'release/'
  }
};

// Error

function onError(e) {
  console.error(e);
  this.emit('end');
}

// Build JS

gulp.task('build-js', function(){
    return gulp.src(path.src.js)
               .pipe(eslint())
               .pipe(eslint.formatEach())
               //.pipe(eslint.failAfterError())
               .on('error', onError)
               .pipe(gulp.dest(path.build.src));
});

gulp.task('bundle-js', ['build-js', 'copy-dev-vendor'], function(){
    return gulp.src(path.build.mainJs)
               .pipe(browserify({
                    standalone: 'Makrene',
                    read: false
               }))
               .on('error', onError)
               .pipe(gulp.dest(path.build.src));
});
  
// Build vendor js

gulp.task('copy-dev-vendor', function(){
    return gulp.src(path.src.dev_vendor)
               .pipe(gulp.dest(path.build.dev_vendor));
  });

// Jade
gulp.task('jade', function() {
  var YOUR_LOCALS = {};
 
  gulp.src(path.src.jade)
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest(path.build.root))
});

// Build media

gulp.task('copy-media', function(){
  return gulp.src(path.src.media)
             .pipe(gulp.dest(path.build.media));
});

// Build vendors

gulp.task('copy-vendors', function(){
  return gulp.src(path.src.vendors)
             .pipe(gulp.dest(path.build.vendors));
});

// Build css

gulp.task('less', function () {
  return gulp.src(path.src.less)
    .pipe(less({
    }))
    .pipe(gulp.dest(path.build.css));
});

gulp.task('default', ['build']);

gulp.task('build', ['bundle-js', 'jade', 'copy-media', 'copy-vendors', 'less']);
