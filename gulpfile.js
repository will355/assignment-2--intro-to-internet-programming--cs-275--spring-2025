import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import eslint from 'gulp-eslint';
import imagemin from 'gulp-imagemin';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';
import dartSass from 'sass';
import fs from 'fs';

const sassCompiler = gulpSass(dartSass);
const bs = browserSync.create();

const paths = {
  scripts: 'js/**/*.js',
  styles: 'css/**/*.scss',
  images: 'img/**/*.{png,jpg,jpeg,gif,svg}',
  html: '*.html',
  output: 'prod/'
};

export function clean() {
  return deleteAsync(['prod']);
}

export function lint() {
  return gulp.src(paths.scripts)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}


export function styles() {
  if (!fs.existsSync('css')) {
    fs.mkdirSync('css', { recursive: true });
  }
  return gulp.src(paths.styles)
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest(`${paths.output}css`))
    .pipe(bs.stream());
}

export function scripts() {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(gulp.dest(`${paths.output}js`));
}

export function images() {
  return gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(`${paths.output}img`));
}

export function copyFiles() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output));
}

export function watchFiles() {
  bs.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch(paths.scripts, gulp.series(lint, scripts)).on('change', bs.reload);
  gulp.watch(paths.styles, styles);
  gulp.watch(paths.html).on('change', bs.reload);
}

export const build = gulp.series(
  clean,
  gulp.parallel(lint, styles, scripts, images, copyFiles)
);

export default gulp.parallel(styles, watchFiles);
