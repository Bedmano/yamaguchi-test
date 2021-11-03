const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const scss = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const del = require("del");
const sync = require("browser-sync").create();

// Styles

const styles = () => {
  return gulp
    .src("source/scss/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(scss())
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(sourcemap.write("."))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// Copy style

const copyStyles = () => {
  return gulp
    .src(["source/css/style.css"], { base: "source" })
    .pipe(gulp.dest("build"));
};

exports.copyStyles = copyStyles;

// HTML

const html = () => {
    return gulp
      .src("source/*.html")
      .pipe(gulp.dest("build"));
  };
  
  exports.html = html;
  
  // script
  
  const script = () => {
    return gulp
      .src("source/js/script.js")
      .pipe(gulp.dest("build/js"))
      .pipe(sync.stream());
  };
  
  exports.script = script;
  
  // Images
  
  const images = () => {
    return gulp
      .src("source/img/**/*.{jpg,png,svg}")
      .pipe(gulp.dest("build/img"));
  };
  
  exports.images = images;

// Copy

const copy = () => {
  return gulp
    .src(
      [
        "source/fonts/*.{woff2,woff}",
        "source/img/**/*.{jpg,png,svg}",
        "source/css/normalize.css",
        "source/css/*.map",
        "source/css/*.css",
      ],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("build"));
};

exports.copy = copy;

const clean = () => {
  return del("build");
};

exports.clean = clean;

// Watcher

const watcher = () => {
    gulp.watch("source/scss/**/*.scss", gulp.series(styles));
    gulp.watch("source/js/script.js", gulp.series(script));
    gulp.watch("source/*.html", gulp.series(html, reload));
  };

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build",
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


// Build

const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    script,
    copy,
    images,
    copyStyles
  )
);

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  gulp.parallel(styles, html, script, copy),
  gulp.series(copyStyles, server, watcher)
);
