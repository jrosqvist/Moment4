// Skapar ett objekt som gör det möjligt att använda angiven gulp-funktionalitet
const {src, dest, watch, series, parallel} = require("gulp");
//Inkluderar gulp-concat och lägger i en varibel
const concatJs = require("gulp-concat");
// Inkluderar uglify-es och lägger i en variabel
const uglify = require ("gulp-uglify-es").default;
// CSS-konkatenering
const concatCss = require('gulp-concat-css');
// CSS-komprimering
const cleanCss = require('gulp-clean-css');
// Browser-sync - används för live-reload i webbläsare
const browserSync = require('browser-sync').create()
// Konvertera Sass till CSS
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
// Sourcemaps används för att kunna se var CSS-koden kommer ifrån
const sourcemaps = require('gulp-sourcemaps');


// Sökvägar
// Skapar ett objekt som plockar alla filer med angivna filformat
const files = {
    htmlPath: "src/**/*.html",
    jsPath: "src/**/*.js",
    cssPath: "src/**/*.css",
    sassPath: "src/scss/*.scss",
    imagesPath: "src/images/*"
}

// Task som kopierar alla html-filer
function htmlTask() {
    // Plockar alla html-filer
    return src(files.htmlPath)
        // Pipe skickar filerna till destinationen "pub"
        .pipe(dest("pub"))
        // Kör livereload
        .pipe(browserSync.stream());
}

// Task som konkatenerar och minifierar js-filer
function jsTask() {
    // Hämtar js-filer
    return src (files.jsPath)
        // Slår ihop js-filerna till en med concat
        .pipe(concatJs("main.js"))
        // Minifierar js-filenmed uglify
        .pipe(uglify())
        // Skickar filerna till mappen js i pub
        .pipe(dest("pub/js"))
        // Kör livereload
        .pipe(browserSync.stream());
}

// Task som konkatenerar och minifierar CSS-filer
function cssTask() {
    // Plockar fram alla css-filer
    return src (files.cssPath)
        // Slår ihop css-filerna till en med concat
        .pipe(concatCss("style.css"))
        // Minifierar CSS-filen
        .pipe(cleanCss({compatibility: 'ie8'}))
        // Skickar filerna till mappen css i pub
        .pipe(dest("pub/css"))
        // Kör livereload
        .pipe(browserSync.stream());
}


// Task som konverterar sass(scss)-filer till css
function sassTask() {
    // Hämtar sass-filer
    return src(files.sassPath)
        // Startar sourcemaps
        .pipe(sourcemaps.init())
        // Konverterar till Css och komrpimerar filen
        .pipe(sass(({outputStyle: 'compressed'})).on('error', sass.logError))
        // Skriver en mappad version
        .pipe(sourcemaps.write("."))
        // Skickar till katalogen pub
        .pipe(dest('pub/css'));
}

// Task som kopierar filer från src och pipar vidare till pub-katalogen
function imageTask () {
    return src (files.imagesPath)
       .pipe(dest("pub/images"));
}

// Watch lyssnar efter förändringar
function watchTask() {
       // En konfigurationsfil för browser-sync skapas
       browserSync.init({
        server: {
            baseDir: 'pub/'
        }
    });
    // Kikar om förändringar gjorts
    watch([files.htmlPath, files.jsPath, files.sassPath, files.imagesPath],
        // Kollar efter html-, css- och js-filer samtidigt
        parallel (htmlTask,jsTask, sassTask, imageTask)
        // Laddar om sidan när någonting förändrats
        ).on('change', browserSync.reload);
}

// Gör dessa funktioner publika
exports.default = series (
    // Dessa tre körs samtidigt
    parallel (htmlTask, jsTask, sassTask, imageTask),
    // Sedan körs watchTask
    watchTask
);
