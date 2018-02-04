// These are important and needed before anything else
// tslint:disable-next-line:no-implicit-dependencies no-import-side-effect
import 'zone.js/dist/zone-node';
// tslint:disable-next-line:no-implicit-dependencies no-import-side-effect
import 'reflect-metadata';
import * as functions from 'firebase-functions';
const { enableProdMode } = require('@angular/core');
const { renderModuleFactory } = require('@angular/platform-server');
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as express from 'express';
import { join, resolve } from 'path';


// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const DIST_FOLDER = join(process.cwd(), './dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../dist-server/main.bundle');


// Import module map for lazy loading

// app.engine('html', ngExpressEngine({
//   bootstrap: AppServerModuleNgFactory,
//   providers: [
//     provideModuleMap(LAZY_MODULE_MAP)
//   ]
// }));

const index = require('fs')
.readFileSync((join(DIST_FOLDER, 'index.html')), 'utf8')
.toString();


app.get('**', (req, res) => {
    renderModuleFactory(AppServerModuleNgFactory, {
        url: req.path,
        document: index,
        extraProviders: [
          provideModuleMap(LAZY_MODULE_MAP)
        ]
    }).then(html => res.status(200).send(html));
});


// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// All regular routes use the Universal engine
// app.get('*', (req, res) => {
//   res.render(join(DIST_FOLDER, 'index.html'), { req });
// });
export const ssr = functions.https.onRequest(app);
