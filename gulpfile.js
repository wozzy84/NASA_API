const gulp = require("gulp");
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const notifier = require('node-notifier');
const c = require('ansi-colors');

sass.compiler = require('node-sass');

function myError(err) {
    //console.log(err.toString());
    console.log(c.red("--------------------"));
    console.log(c.red(err.messageFormatted));
    console.log(c.red("--------------------"));

    notifier.notify({
        title: "Błąd kompilacji SCSS",
        message: err.messageFormatted
    });
}

function server(cb) {
    browserSync.init({
        server: {
            baseDir: "./"
        },
      
    });

    cb();
}

function css() {
    return gulp.src('./scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle : "expanded" //compressed, expanded, nested, compact
        }).on('error', myError))
        .pipe(autoprefixer({}))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream())
}

function watch(cb) {
    gulp.watch("./scss/**/*.scss", gulp.series(css));
    gulp.watch("./*.html").on('change', browserSync.reload);
    cb();
}

function start(cb) {
    console.log(c.yellow('========================'));
    console.log(c.blue('START PRACY'));
    console.log(c.yellow('========================'));
    cb();
}

exports.css = css;
exports.default = gulp.series(start, server, css, watch);