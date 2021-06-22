const { series, src, dest, watch } = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const browserSync = require('browser-sync').create();

function deps() {
  return src([
    'node_modules/admin-lte/plugins/jQuery/jquery-2.2.3.min.js',
    'node_modules/admin-lte/bootstrap/js/bootstrap.min.js',
    'node_modules/admin-lte/plugins/slimScroll/jquery.slimscroll.min.js',
    'node_modules/admin-lte/dist/js/app.min.js',
    'node_modules/angular/angular.min.js',
    'node_modules/angular-animate/angular-animate.js',
    'node_modules/@uirouter/angularjs/release/angular-ui-router.min.js',
    'node_modules/angular-toastr/dist/angular-toastr.tpls.min.js',
  ])
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    ).pipe(uglify())
    .pipe(concat('deps.min.js'))
    .pipe(dest('public'));
}

function css() {
  return src([
    'node_modules/admin-lte/bootstrap/css/bootstrap.min.css',
    'node_modules/admin-lte/dist/css/AdminLTE.min.css',
    'node_modules/admin-lte/dist/css/skins/_all-skins.min.css',
    'node_modules/angular-toastr/dist/angular-toastr.min.css',
    'node_modules/font-awesome/css/font-awesome.min.css',
    'app/**/*.css'
  ])
    .pipe(cssmin())
    .pipe(concat('deps.min.css'))
    .pipe(dest('public/css'));
}

function js() {
  return src('app/**/*.js')
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(dest('public'));
}

function html() {
  return src('app/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('public'))
}

function assets() {
  return src([
    'app/assets/*'
  ]).pipe(dest('public/assets'));
}

function fonts() {
  return src([
    'node_modules/font-awesome/fonts/*',
    'node_modules/admin-lte/bootstrap/fonts/*',
  ])
    .pipe(dest('public/fonts'));
}

function serve(done) {
  browserSync.reload();
  done();
}

exports.default = function () {
  browserSync.init({
    server: './public',
    port: 3004,
    host: '172.27.209.45'
  });

  watch('app/**/*.js', { ignoreInitial: false }, series(deps, js, serve));
  watch('app/**/*.css', { ignoreInitial: false }, series(css, fonts, serve));
  watch('app/**/*.html', { ignoreInitial: false }, series(html, assets, serve));
  watch('app/assets/*', { ignoreInitial: false }, series(assets, fonts, serve));
}
