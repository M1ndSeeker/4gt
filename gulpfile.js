const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();

let sourceMaps = process.argv.includes('--map');
let minifyCss = process.argv.includes('--minify');

function clean() {
    return del('./app/*');
}

function styles() {
	return gulp.src('./src/css/**/*.css')
				.pipe(gulpIf(sourceMaps, sourcemaps.init()))
				.pipe(concat('style.css'))
				.pipe(autoprefixer({}))
				.pipe(gulpIf(minifyCss, cleanCSS({
					level: 2
				})))
				.pipe(gulpIf(sourceMaps, sourcemaps.write()))
				.pipe(gulp.dest('./app/css'))
				.pipe(browserSync.stream());
};

function watch() {
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });
	gulp.watch('./src/css/**/*.css', styles);
	gulp.watch("./*.html").on('change', browserSync.reload);
}

let buildWithClean = gulp.series(clean, styles);
let dev = gulp.series(buildWithClean, watch);

gulp.task('build', buildWithClean);
gulp.task('dev', dev);
