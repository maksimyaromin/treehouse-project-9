/*
    Я использовал несколько галп-задач из предыдущего проекта для сборки стилей и изображений. Вы можете сказать, что в подходе create-react-app стили
    пишутся для каждого компонента и собираются встроенным веб-паком. И даже при желании можно использовать SCSS или LESS. Но я считал и считаю такой подход
    грязным. Много дискуссий на эту тему поднято, но мне приятней писать стили в отдельном месте. А верстку снабжать понятными CSS классами по БЭМ методологии (немного
    мной модернизированной под себя). Мои галп-задачи встроены в процесс сборки. Запускать приложение вы можете по прежнему командой npm start, а собирать npm run build
*/
const package = require("./package.json");

const      gulp = require("gulp"),
            del = require("del"),
            iff = require("gulp-if"),
        plumber = require("gulp-plumber"),
          newer = require("gulp-newer"),
         cached = require("gulp-cached"),
       fancyLog = require("fancy-log"),
          print = require("gulp-print").default,
         moment = require("moment"),
         header = require("gulp-header"),
     sourcemaps = require("gulp-sourcemaps"),
        cssnano = require("gulp-cssnano"),
         concat = require("gulp-concat"),
           size = require("gulp-size")
           //sass = require("gulp-compass"),
       imagemin = require("gulp-imagemin"),
           svgo = require("gulp-svgmin"),
    runSequence = require("run-sequence").use(gulp);

const onError = err => {
    console.log(err);
};

const banner = 
`/**
 * @project     ${package.name}
 * @author      ${package.author}
 * @build       ${moment().format("LLLL")}
 * @release     
 * @copyright   Copyright (c) ${moment().format("YYYY")}, ${package.author}
*/

`;

gulp.task("clean", () => {
    fancyLog("-> Clean dist assets folder");
    del("./public/assets/**/*");
});

gulp.task("compile:scss", () => {
    fancyLog("-> Compiling scss");
    return gulp.src(package.paths.src.scss + package.vars.scssName)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass({
            config_file: package.paths.compass,
            sass: package.paths.src.scss,
            css: package.paths.build.css
        }))
        .pipe(cached("sass"))
        .pipe(sourcemaps.write("./"))
        .pipe(size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(package.paths.build.css));     
});

gulp.task("styles", [ "compile:scss" ], () => {
    fancyLog("-> Building css");
    return gulp.src(package.globs.distCss)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(newer({ dest: package.paths.dist.css + "styles.css" }))
        .pipe(print())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(concat("styles.css"))
        .pipe(cssnano({
            discardComments: {
                removeAll: true
            },
            discardDuplicates: true,
            discardEmpty: true,
            minifyFontValues: true,
            minifySelectors: true
        }))
        .pipe(header(banner))
        .pipe(sourcemaps.write("./"))
        .pipe(size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(package.paths.dist.css));
});

gulp.task("images", () => {
    fancyLog("-> Images optimizing");
    return gulp.src(package.paths.src.images + "**/*.{png,jpg,ico,svg}")
        .pipe(plumber({ errorHandler: onError }))
        .pipe(iff([ "*.{png,jpg}" ], imagemin({
            progressive: true,
            interlaced: true,
            optimizationLevel: 7,
            svgoPlugins: [ { removeViewBox: false } ],
            verbose: true,
            use: []
        })))
        .pipe(iff([ "*.svg" ], svgo({
            plugins: [{
                cleanupIDs: { remove: false }
            }]
        })))
        .pipe(gulp.dest(package.paths.dist.images));
});

gulp.task("build:assets", (done) => {
    //runSequence("clean", "styles", "images", done);
});

gulp.task("watch:scss", () => {
    //    gulp.watch([ 
    //        package.paths.src.scss + "**/*.scss"
    //    ], [ "styles" ]);
});