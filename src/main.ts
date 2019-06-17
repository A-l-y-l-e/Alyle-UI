import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@env/environment';

import { hmrBootstrap } from './hmr';

import 'hammerjs';

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if (environment.hmr) {
  if (module[ 'hot' ]) {
    hmrBootstrap(module, bootstrap);
  } else {
    console.error('HMR is not enabled for webpack-dev-server!');
    console.log('Are you using the --hmr flag for ng serve?');
  }
} else {
  if (!environment.production) {
    const style = <HTMLLinkElement>window.document.createElement('link');
    style.setAttribute('href', 'http://localhost:10009/fonts.css');
    style.setAttribute('rel', 'stylesheet');
    window.document.head.appendChild(style);
  }
  bootstrap();
}
