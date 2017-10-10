var uglify = require('rollup-plugin-uglify');
  gulp = require('gulp'),
  watch = require('gulp-watch');
  path = require('path'),
  ngc = require('@angular/compiler-cli/src/main').main,
  rollup = require('gulp-rollup'),
  rename = require('gulp-rename'),
  _replace = require('gulp-replace'),
  del = require('del'),
  runSequence = require('run-sequence'),
  inlineResources = require('./tools/gulp/inline-resources'),
  _replace = require('gulp-replace');

const rootFolder = path.join(__dirname);
const libFolder = path.join(rootFolder, 'src/lib');
const tmpFolder = path.join(rootFolder, '.tmp');
const buildFolder = path.join(rootFolder, 'build');
const distFolder = path.join(rootFolder, 'dist');

/**
 * 1. Clone the /src/lib folder into /.tmp. If an npm link inside /src has been made,
 *    then it's likely that a node_modules folder exists. Ignore this folder
 *    when copying to /.tmp.
 */
gulp.task('copy:source', function () {
  return gulp.src([`${libFolder}/**/*`, `!${libFolder}/node_modules`])
    .pipe(gulp.dest(tmpFolder));
});

/**
 * 2. Inline template (.html) and style (.css) files into the the component .ts files.
 *    We do this on the /.tmp folder to avoid editing the original /src files
 */
gulp.task('inline-resources', function () {
  return Promise.resolve()
    .then(() => inlineResources(tmpFolder));
});

/**
 * 3. Run the Angular compiler, ngc, on the /.tmp folder. This will output all
 *    compiled modules to the /build folder.
 */
gulp.task('ngc:packpage', function () {
  return ngc({
    project: `${tmpFolder}/tsconfig.es5.json`
  })
    .then((exitCode) => {
      if (exitCode === 1) {
        // This error is caught in the 'compile' task by the runSequence method callback
        // so that when ngc fails to compile, the whole compile process stops running
        throw new Error('ngc compilation failed');
      }
    });
});

/**
 * 6. Run rollup inside the /build folder to generate our UMD module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:umd', function () {
  return gulp.src(`${buildFolder}/**/*.js`)
  //*/
  // transform the files here.
    .pipe(rollup({

      // Bundle's entry point
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#entry
      input: `${buildFolder}/index.js`,

      // Allow mixing of hypothetical and actual files. "Actual" files can be files
      // accessed by Rollup or produced by plugins further down the chain.
      // This prevents errors like: 'path/file' does not exist in the hypothetical file system
      // when subdirectories are used in the `src` directory.
      allowRealFiles: true,

      plugins: [
        // uglify(),
      ],

      onwarn: function (warning) {
        // Suppress this error message... there are hundreds of them. Angular team says to ignore it.
        // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
        if (warning.code === 'THIS_IS_UNDEFINED'){
          return;
        } else {
          console.error(warning.message);
        }
      },

      // A list of IDs of modules that should remain external to the bundle
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#external
      external: [
        '@angular/core',
        '@angular/common',
        '@angular/forms',
        '@angular/http',
        '@angular/platform-browser',
        'alyle-ui',
        'alyle-ui/core',
        'node-vibrant',
        'rxjs/BehaviorSubject',
        'rxjs/Observable',
        'rxjs/add/observable/of',
        'rxjs/add/observable/catch',
        'rxjs/add/observable/finally',
        'rxjs/add/observable/map',
        'rxjs/add/observable/share',
      ],

      // Format of generated bundle
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#format
      format: 'umd',

      // Export mode to use
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#exports
      exports: 'named',

      // The name to use for the module for UMD/IIFE bundles
      // (required for bundles with exports)
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#modulename
      name: 'alyle',

      // See https://github.com/rollup/rollup/wiki/JavaScript-API#globals
      globals: {
        typescript: 'ts'
      }

    }))
    .pipe(rename('alyle-ui.umd.js'))
    .pipe(gulp.dest(buildFolder));
});

/**
 * Fix name package
 */
gulp.task('...', function(){
  return;
});

gulp.task('compile', function () {
  runSequence(
    'copy:source',
    'inline-resources',
    'ngc:packpage',
    'rollup:umd',
    '...',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});
