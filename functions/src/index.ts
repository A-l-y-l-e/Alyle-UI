// These are important and needed before anything else
// tslint:disable-next-line:no-implicit-dependencies no-import-side-effect
import 'zone.js/dist/zone-node';
// tslint:disable-next-line:no-implicit-dependencies no-import-side-effect
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';
import * as functions from 'firebase-functions';

import * as express from 'express';
import { join } from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const DIST_FOLDER = join(process.cwd(), './dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../dist-server/main.bundle');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));


// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'index.html'), { req });
});
export const ssr = functions.https.onRequest(app);
