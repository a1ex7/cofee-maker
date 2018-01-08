var gulp           = require('gulp'),
    gutil          = require('gulp-util' ),
    sass           = require('gulp-sass'),
    browserSync    = require('browser-sync'),
    concat         = require('gulp-concat'),
    uglify         = require('gulp-uglify'),
    cleanCSS       = require('gulp-clean-css'),
    rename         = require('gulp-rename'),
    del            = require('del'),
    imagemin       = require('gulp-imagemin'),
    svgSprite      = require('gulp-svg-sprite'),
    cache          = require('gulp-cache'),
    autoprefixer   = require('gulp-autoprefixer'),
    notify         = require('gulp-notify'),
    sourcemaps     = require('gulp-sourcemaps'),
    fileinclude    = require('gulp-file-include');



/* Tasks */


/* Html with includes */

gulp.task('html', function() {
  gulp.src('src/html/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true,
    }))
    .pipe(gulp.dest('src'));
});


/* Compress common scripts */

gulp.task('common-js', function() {
  return gulp.src([
      'src/js/common.js',
    ])
  .pipe(concat('common.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('src/js'));
});


/* Concatenate Libs scripts and common scripts */

gulp.task('js', ['common-js'], function() {
  return gulp.src([

      'src/libs/jquery/dist/jquery.min.js',
      'src/libs/rellax/rellax.min.js',
      'src/libs/slick-carousel/slick/slick.min.js',

      'src/js/common.min.js',
    ])
  .pipe(concat('scripts.min.js'))
  // .pipe(uglify())   // optional, if lib scripts not minimized
  .pipe(gulp.dest('src/js'))
  .pipe(browserSync.reload({stream: true}));
});


/* Magic with sass files */

gulp.task('sass', function() {
  return gulp.src('src/sass/**/*.sass')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', notify.onError()))
  .pipe(rename({suffix: '.min', prefix : ''}))
  .pipe(autoprefixer(['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']))
  // .pipe(cleanCSS()) // Optional, remove unused style rules !danger
  .pipe(sourcemaps.write('/'))
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.reload({stream: true}));
});


/* Browser Sync Server */

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'src'
    },
    notify: true,
  });
});


/* Monitoring */

gulp.task('watch', ['html', 'sass', 'js', 'browser-sync'], function() {
  gulp.watch('src/html/**/*.html', ['html']);
  gulp.watch('src/sass/**/*.sass', ['sass']);
  gulp.watch(['libs/**/*.js', 'src/js/common.js'], ['js']);
  gulp.watch('src/*.html', browserSync.reload);
});


/* Image optimization */

gulp.task('imagemin', function() {
  return gulp.src('src/img/**/*')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.svgo({plugins: [{
      removeViewBox: false,
      removeUselessStrokeAndFill: true,
    }]}),
  ]))
  .pipe(gulp.dest('dist/img'));
});

/* Generate SVG Sprites */
gulp.task('sprites', function() {
  return gulp.src('src/img/svg/**/*.svg')
  .pipe(svgSprite(
    {
      log: 'info',
      shape: {
          spacing: {
              padding: 0
          }
      },
      mode: {
        view: {
          dest: 'sass',
          dimensions: true,
          bust: false,
          sprite: '../img/sprites/sprite.svg',
          render: {
              scss: {
                  dest: '_sprite.scss',
                  template: 'src/img/sprites/tmpl/sprite.scss'
              }
          },
          example: {
              dest: '../img/sprites/sprite.html'
          }
        }
      }
    }
  ))
  .pipe(gulp.dest('src'));
});

/* Build project */

gulp.task('build', ['removedist', 'imagemin', 'html', 'sass', 'js'], function() {

  var buildHtml = gulp.src([
    'src/*.html',
  ]).pipe(gulp.dest('dist'));

  var buildCss = gulp.src([
    'src/css/main.min.css',
  ]).pipe(gulp.dest('dist/css'));

  var buildJs = gulp.src([
    'src/js/scripts.min.js',
  ]).pipe(gulp.dest('dist/js'));

  var buildFonts = gulp.src([
    'src/fonts/**/*',
  ]).pipe(gulp.dest('dist/fonts'));

});


/* Helpers */

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });


/* Go! */

gulp.task('default', ['watch']);