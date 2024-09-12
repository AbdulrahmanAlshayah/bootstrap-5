const gulp = require("gulp"),
  concat = require("gulp-concat"),
  sass = require("gulp-sass")(require("sass")),
  pug = require("gulp-pug"),
  livereload = require("gulp-livereload"),
  sourcemaps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify"),
  notify = require("gulp-notify"),
  ts = require("gulp-typescript"),
  html2jade = require("gulp-html2jade");
// ftp = require("vinly-ftp");

gulp.task("img", function () {
  return gulp
    .src("project/imgs/*.*")
    .pipe(gulp.dest("dist/imgs"))
    .pipe(livereload());
});

gulp.task("html", function () {
  return (
    gulp
      .src("project/html/*.pug")
      .pipe(pug({ pretty: true }))
      .pipe(gulp.dest("dist"))
      // .pipe(notify("Html Task Is Done"))
      .pipe(livereload())
  );
});

gulp.task("jade", function () {
  gulp
    .src("project/html/jade.html")
    .pipe(html2jade({ nspaces: 2 }))
    .pipe(gulp.dest("project/jade"));
});

gulp.task("css", async function () {
  const autoprefixer = (await import("gulp-autoprefixer")).default;

  return (
    gulp
      .src(["project/css/*.scss", "project/css/*.sass"])
      .pipe(sourcemaps.init())
      // .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(sass().on("error", sass.logError))
      .pipe(autoprefixer())

      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 2 versions"],
          cascade: false,
        })
      )
      // .pipe(concat("main.css"))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("dist/css"))
      .pipe(livereload())
  );
});

gulp.task("js", function () {
  return gulp
    .src("project/js/*.js")
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/"))
    .pipe(livereload());
});

gulp.task("ts", function () {
  return gulp
    .src("project/js/TypeScript/*.ts")
    .pipe(sourcemaps.init())
    .pipe(
      ts({
        noImplicitAny: true,
        removeComments: true,
        outFile: "output.js",
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/js"));
});

// Compresed File
gulp.task("compresed", async function () {
  const zip = (await import("gulp-zip")).default;

  return gulp
    .src("dist/**/*.*")
    .pipe(zip("website.zip"))
    .pipe(gulp.dest("."))
    .pipe(notify("File Is Compresed"));
});

//gulp watch
gulp.task("watch", function () {
  require("./server.js");
  livereload.listen();
  gulp.watch("project/imgs/*.*", gulp.series("img"));
  gulp.watch("project/**/*.pug", gulp.series("html"));
  gulp.watch("project/html/jade.html", gulp.series("jade"));
  gulp.watch(
    ["project/css/**/*.scss", "project/css/**/*.sass"],
    gulp.series("css")
  );
  gulp.watch("project/js/*.js", gulp.series("js"));
  gulp.watch("project/js/TypeScript/*.ts", gulp.series("ts"));
  // gulp.watch("project/**/*.*", gulp.series("compresed"));
});

// // function abd() {
// //   return gulp
// //     .src("project/*.css")
// //     .pipe(prefix())
// //     .pipe(concat("main.css"))
// //     .pipe(gulp.dest("dist"));
// // }

// // exports.abd = abd;
