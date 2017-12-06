var uglify = require('rollup-plugin-uglify');
  gulp = require('gulp'),
  watch = require('gulp-watch');
  path = require('path'),
  fs = require('fs'),
  ngc = require('@angular/compiler-cli/src/main').main,
  rollup = require('gulp-rollup'),
  rename = require('gulp-rename'),
  _replace = require('gulp-replace'),
  del = require('del'),
  runSequence = require('run-sequence'),
  inlineResources = require('./tools/gulp/inline-resources'),
  _replace = require('gulp-replace')
  chalk = require('chalk');
const util = require('util');

const log = console.log;
log(chalk.black.hex('#DEADED')('Alyle UI'));

const {copySync, writeFileSync, readFileSync, ensureDirSync } = require('fs-extra');

var child_process = require('child_process');

const rootFolder = path.join(__dirname);
const libFolder = path.join(rootFolder, 'src/lib');
const tmpFolder = path.join(rootFolder, '.tmp');
const buildFolder = path.join(rootFolder, 'build');
const distFolder = path.join(rootFolder, 'dist');
const pkg = readFileSync(path.join(libFolder, 'package.json'), 'utf8');
const tsconfigEsm = readFileSync(path.join(libFolder, 'tsconfig.esm.json'), 'utf8');
const tsconfigEs2015 = readFileSync(path.join(libFolder, 'tsconfig.build.json'), 'utf8');
function srcOf(dir) {
  return path.join(rootFolder, dir);
}

const EXTERNALS = [
  /**Angular */
  '@angular/core',
  '@angular/common',
  '@angular/forms',
  '@angular/http',
  '@angular/animations',
  '@angular/platform-browser',
  /**Rxjs */
  'rxjs/Observable',
  'rxjs/BehaviorSubject',
  'rxjs/Subject',
  'rxjs/observable/fromEvent',
  'rxjs/Observer',
  /**AlyleUI */
  'alyle-ui/button',
  'alyle-ui/carousel',
  'alyle-ui/checkbox',
  'alyle-ui/core',
  'alyle-ui/header-paginations',
  'alyle-ui/icon-button',
  'alyle-ui/input',
  'alyle-ui/ls',
  'alyle-ui/menu',
  'alyle-ui/radio',
  'alyle-ui/responsive',
  'alyle-ui/ripple',
  'alyle-ui/shadow',
  'alyle-ui/svg',
  'alyle-ui/tabs',
  'alyle-ui/toolbar',
  /**Vibrant js */
  'node-vibrant',
  /**Deep Assign */
  'deep-assign',
  'chroma-js'
];
const GLOBALS = {
  '@angular/core': 'ng.core',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/common': 'ng.common',
  '@angular/forms': 'ng.forms',
  '@angular/http': 'ng.http',
  '@angular/animations': 'ng.animations',
  'alyle-ui/button': 'button',
  'alyle-ui/carousel': 'carousel',
  'alyle-ui/core': 'core',
  'alyle-ui/header-paginations': 'header-paginations',
  'alyle-ui/icon-button': 'icon-button',
  'alyle-ui/ls': 'ls',
  'alyle-ui/menu': 'menu',
  'alyle-ui/responsive': 'responsive',
  'alyle-ui/ripple': 'ripple',
  'alyle-ui/shadow': 'shadow',
  'rxjs': 'Rx',
  'rxjs/Observable': 'Rx',
  'rxjs/Subject': 'Rx',
  'rxjs/Observer': 'Rx',
  'rxjs/Subscription': 'Rx',
  'rxjs/BehaviorSubject': 'Rx',
  'rxjs/observable/merge': 'Rx.Observable',
  'rxjs/operator/share': 'Rx.Observable.prototype',
  'rxjs/operator/observeOn': 'Rx.Observable.prototype',
  'rxjs/observable/of': 'Rx.Observable.prototype',
  'rxjs/operator/combineLatest': 'Rx.Observable.prototype',
  'rxjs/operator/merge': 'Rx.Observable.prototype',
  'rxjs/operator/map': 'Rx.Observable.prototype',
  'rxjs/observable/of': 'Rx.Observable',
  'rxjs/operator/auditTime': 'Rx.Observable.prototype',
  'rxjs/operator/switchMap': 'Rx.Observable.prototype',
  'rxjs/operator/do': 'Rx.Observable.prototype',
  'rxjs/operator/skip': 'Rx.Observable.prototype',
  'rxjs/operator/take': 'Rx.Observable.prototype',
  'rxjs/operator/toArray': 'Rx.Observable.prototype',
  'rxjs/operator/toPromise': 'Rx.Observable.prototype',
  'rxjs/add/operator/map': 'Rx.Observable.prototype',
  'rxjs/add/operator/scan': 'Rx.Observable.prototype',
  'rxjs/add/operator/skip': 'Rx.Observable.prototype',
  'rxjs/add/operator/do': 'Rx.Observable.prototype',
  'rxjs/add/operator/distinctUntilChanged': 'Rx.Observable.prototype',
  'rxjs/add/operator/filter': 'Rx.Observable.prototype',
  'rxjs/add/operator/skipUntil': 'Rx.Observable.prototype',
  'rxjs/add/operator/skipWhile': 'Rx.Observable.prototype',
  'rxjs/add/operator/withLatestFrom': 'Rx.Observable.prototype',
  'rxjs/add/operator/switchMap': 'Rx.Observable.prototype',
  'rxjs/add/observable/merge': 'Rx.Observable',
  'rxjs/add/observable/of': 'Rx.Observable.prototype',
  'rxjs/add/observable/fromPromise': 'Rx.Observable.prototype',
  'rxjs/add/operator/delay': 'Rx.Observable',
  'rxjs/add/operator/debounce': 'Rx.Observable',
  'rxjs/add/operator/share': 'Rx.Observable',
  'rxjs/observable/fromEvent': 'Rx.Observable',
  'rxjs/observable/from': 'Rx.Observable',
  'rxjs/operator': 'Rx.Observable.prototype',
  'rxjs/scheduler/queue': 'Rx.Scheduler',
  'chroma-js': 'chroma'
};

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

const libs = getFolders(libFolder);
libs.push('');
const libsPackage = libs.slice();
libs.forEach((lib, index) => {
  let packageUmd = `package:alyle-ui/${lib}:umd`;
  libs[index] = packageUmd;
  gulp.task(packageUmd, function() {
    return rollupUmd(lib);
  });
});

function changeRootFolderLib(name) {
  return name !== '' ? name : 'alyle-ui';
}

/**
 * Copy & create tsconfig
 */
libsPackage.forEach(name => {
  const baseUrl = name !== '' ? `../` : './';
  const baseUrlesm = name !== '' ? `../` : './';
  const outPathTemp = srcOf(`.tmp/${name}`);
  const outPathBuild = srcOf(`build/${name}`);
  let files = ['index.ts'];
  copySync(srcOf('src/lib/tsconfig.build.json'), `${outPathTemp}/tsconfig.build.json`);
  let newtsconfig = tsconfigEs2015
  .replace('ROOT_FILE', name !== '' ? `"files": ${JSON.stringify(files)},` : '')
  .replace(/BASE_URL/g, baseUrl)
  .replace('NAME_PACKAGE', name);
  let newPkg = pkg.replace('NAME_PACKAGE', name !== '' ? `/${name}` : '');
  writeFileSync(`${outPathTemp}/tsconfig.build.json`, newtsconfig);
  copySync(srcOf('src/lib/tsconfig.esm.json'), `${outPathTemp}/tsconfig.esm.json`);
  let newtsconfigesm = tsconfigEsm
  .replace('ROOT_FILE', `"files": ${JSON.stringify(files)},`)
  .replace(/FLAT_MODULE_OUT_FILE/g, `/${changeRootFolderLib(name)}.ly`)
  .replace(/NAME_PACKAGE/g, `/${name}`)
  .replace(/OUT_DIR/g, baseUrl)
  .replace(/BASE_URL/g, baseUrlesm);
  writeFileSync(`${outPathTemp}/tsconfig.esm.json`, newtsconfigesm);
});

gulp.task('compile:umd',function () {
  runSequence(
    ...libs,
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

/**
 * Clone the /src/lib folder into /.tmp.
 */
gulp.task('copy:source', function () {
  return gulp.src([`${libFolder}/**/!(*.json|*.md)*`])
    .pipe(gulp.dest(tmpFolder));
});

/**
 * Inline template (.html) and style (.css) files into the the component .ts files.
 *    We do this on the /.tmp folder to avoid editing the original /src files
 */
gulp.task('inline-resources', function () {
  return Promise.resolve()
    .then(() => inlineResources(tmpFolder));
});

/**
 * Run the Angular compiler, ngc, on the /.tmp folder. This will output all
 *    compiled modules to the /build folder.
 */
gulp.task('ngc', function () {
  /**
   * es2015
   */
  ngc([ '--project', `${tmpFolder}/tsconfig.build.json` ]);
  log(chalk.black.bgYellow('es2015 Complete'));
  /**
   * esm
   */
  libsPackage.forEach(name => {
    ngc([ '--project', `${tmpFolder}/${name}/tsconfig.esm.json` ]);
    log(chalk.yellow(name));
    log(chalk.yellow(`copy:package: ${name}`));
    copySync(srcOf('src/lib/package.json'), `${srcOf(`build/${name}`)}/package.json`);
    const newPkg = pkg
    .replace(/MODULE/g, name !== '' ? `${name}.ly.js` : 'alyle-ui.ly.js')
    .replace(/TYPINGS/g, name !== '' ? `${name}.ly.d.ts` : 'alyle-ui.ly.d.ts')
    .replace(/MAIN/g, name !== '' ? `ly.${name}.umd.js` : 'ly.umd.js')
    .replace(/ES2015/g, name !== '' ? `../es2015/${name}/index.js` : './es2015/index.js')
    .replace(/NAME_PACKAGE/g, name !== '' ? `/${name}` : '');
    writeFileSync(`${srcOf(`build/${name}`)}/package.json`, newPkg);
  });
  return Promise.resolve()
});
/**
 * Copy all files of build to dist
 */
gulp.task('copy:readme', function () {
  return gulp.src([`${libFolder}/README.md`])
    .pipe(gulp.dest(buildFolder));
});

/**
 * Run rollup inside the /build folder to generate our UMD module and place the
 * generated file into the /dist folder
 */

function rollupUmd (lib) {
  let dir = `${buildFolder}/${lib}`;
  let dist = `${distFolder}/${lib}`;
  let name = lib !== '' ? `ly.${lib}` : 'ly';
  return gulp.src(`${dir}/*.js`)
  //*/
  // transform the files here.
    .pipe(rollup({

      // Bundle's entry point
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#entry
      input: `${dir}/index.js`,

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
      external: EXTERNALS,

      // Format of generated bundle
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#format
      format: 'umd',

      // Export mode to use
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#exports
      exports: 'named',

      // The name to use for the module for UMD/IIFE bundles
      // (required for bundles with exports)
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#modulename
      name: `${name}`,

      // See https://github.com/rollup/rollup/wiki/JavaScript-API#globals
      globals: {
        typescript: 'ts',
        ...GLOBALS
      }

    }))
    .pipe(rename(`${name}.umd.js`))
    .pipe(gulp.dest(dir));
};

gulp.task('...', function(){
  return;
});

gulp.task('build:package', function () {
  runSequence(
    'copy:source',
    'inline-resources',
    'ngc',
    'compile:umd',
    'copy:readme',
    '...',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});
