const gulp = require('gulp');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const gcmq = require('gulp-group-css-media-queries');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const less = require('gulp-less');
const browserSync = require('browser-sync').create();

let isSync = process.argv.includes('--sync');
let isMap = process.argv.includes('--map');
let isMinify = process.argv.includes('--minify');

function clean() {
    return del('./app/*');
}

function styles() {
	return gulp.src('./src/css/style.less')
				.pipe(gulpIf(isMap,sourcemaps.init()))
				.pipe(less())
				.pipe(autoprefixer({}))
				.pipe(gcmq())
				.pipe(gulpIf(isMinify, cleanCSS({
					level: 2
				})))
				.pipe(gulpIf(isMap,sourcemaps.write()))
				.pipe(gulp.dest('./app/css'))
				.pipe(gulpIf(isSync, browserSync.stream()));
};

function pictures() {
	return gulp.src('./src/img/**/*')
				.pipe(gulp.dest('./app/img'));
};

function watch() {
	if (isSync) {
		browserSync.init({
			server: {
				baseDir: "./"
			}
		});
	}
	gulp.watch('./src/css/**/*.less', styles);
	gulp.watch("./*.html").on('change', browserSync.reload);
}

let build = gulp.parallel(styles, pictures);
let buildWithClean = gulp.series(clean, build);
let dev = gulp.series(buildWithClean, watch);

gulp.task('build', buildWithClean);
gulp.task('dev', dev);