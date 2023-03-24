const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const jsmin = require('gulp-jsmin');
const rename = require('gulp-rename');
const del = require('del');
const imagemin = require('gulp-imagemin');
const svgstore = require('gulp-svgstore');
const webp = require('gulp-webp');
const fileinclude = require('gulp-file-include');
const sync = require('browser-sync').create();
const pug = require('pug');

// Styles

const styles = () => {
  return (
    gulp
      .src('source/sass/**/*.scss')
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(sass())
      // .pipe(gulp.src('source/css/**/*.css')) //all css
      .pipe(postcss([autoprefixer()]))
      .pipe(sourcemap.write('.'))
      // .pipe(gulp.dest('build/css')) // style.css
      .pipe(cssmin())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('build/css')) //style.min.scc
      .pipe(sync.stream())
  );
};

exports.styles = styles;

// HTML

const html = () => {
  return gulp
    .src('source/**/*.html')
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
};

exports.html = html;

// clean

const clean = () => {
  return del('build');
};

exports.clean = clean;

// copy

const copyBuild = (done) => {
  gulp
    .src(
      [
        'source/fonts/*/*.{woff2,woff}',
        'source/*.ico',
        'source/img/favicon/manifest.webmanifest',
        'source/img/**/*.svg',
        '!source/img/icons/*.svg',
      ],
      {
        base: 'source',
      }
    )
    .pipe(gulp.dest('build'));
  done();
};

const copyDev = (done) => {
  gulp
    .src(
      [
        'source/fonts/*/*.{woff2,woff}',
        'source/css/*.*',
        'source/*.ico',
        'source/img/**/*.svg',
        'source/img/favicon/manifest.webmanifest',
        '!source/img/icons/*.svg',
      ],
      {
        base: 'source',
      }
    )
    .pipe(gulp.dest('build'));
  done();
};

// images

const optimizeImages = () => {
  return gulp
    .src('source/img/**/*.{jpg,png,svg}')
    .pipe(
      imagemin([
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo(),
      ])
    )
    .pipe(gulp.dest('build/img'));
};

exports.optimizeImages = optimizeImages;

const copyImages = () => {
  return gulp.src('source/img/**/*.{svg}').pipe(gulp.dest('build/img'));
};

exports.copyImages = copyImages;

// webp

const createWebp = () => {
  return gulp
    .src('source/img/**/*.{jpg,png}')
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('build/img'));
};

exports.createWebp = createWebp;

// scripts

const scripts = () => {
  return (
    gulp
      .src('source/js/*.js')
      .pipe(jsmin())
      // .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest('build/js'))
  );
};

exports.scripts = scripts;

// sprites

const sprite = () => {
  return gulp
    .src('source/img/icons/*.svg')
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
};

exports.sprite = sprite;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build',
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles, reload));
  gulp.watch('source/js/*.js', gulp.series(scripts, reload));
  gulp.watch('source/img/icons/*.svg', gulp.series(sprite, reload));
  gulp.watch('source/*.html', gulp.series(html, reload));
  gulp.watch('source/html/*.htm', gulp.series(html, reload));
};

// Build

const build = gulp.series(
  clean,
  copyBuild,
  optimizeImages,
  gulp.parallel(styles, html, scripts, sprite, createWebp)
);

exports.build = build;

//default
exports.default = gulp.series(
  clean,
  copyDev,
  copyImages,
  gulp.parallel(styles, html, scripts, sprite, createWebp),
  gulp.series(server, watcher)
);
