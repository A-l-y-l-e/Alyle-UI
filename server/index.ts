import 'reflect-metadata';
require('zone.js/dist/zone-node');
import { enableProdMode } from '@angular/core';
const { LAZY_MODULE_MAP } = require('../dist/server/main.bundle');
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
const express = require('express');
import { join, resolve } from 'path';

enableProdMode();
const renderModuleFactory = require('@angular/platform-server').renderModuleFactory;

const AppServerModuleNgFactory = require('../dist/server/main.bundle').AppServerModuleNgFactory;

const index = require('fs').readFileSync(resolve(__dirname, '../dist/browser/index.html'), 'utf8');
const DIST_FOLDER = join(process.cwd(), 'dist');
const app = express();
app.get('/', function(req, res) {
  renderModuleFactory(AppServerModuleNgFactory, {
    document: index,
    url: '/',
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  })
      .then(function(html) {
         res.send(html);
      }).catch( function(e) {
         console.log(e);
      });
});
app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));
// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));
console.log(join(DIST_FOLDER, 'browser'));
app.listen(1111, () => {
  console.log(`Node server listening on http://localhost:${1111}`);
});
