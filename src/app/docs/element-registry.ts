import { LoadChildrenCallback } from '@angular/router';
import { InjectionToken } from '@angular/core';

export const ELEMENT_MODULE_LOAD_CALLBACKS_AS_ROUTES = [
  {
    path: '/customization/dynamic-styles',
    loadChildren: () => import('./customization/dynamic-styles.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/customization/paper',
    loadChildren: () => import('./customization/paper.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/customization/multiple-themes',
    loadChildren: () => import('./customization/multiple-themes.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/grid',
    loadChildren: () => import('./layout/grid-demo/grid.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/responsive',
    loadChildren: () => import('./layout/responsive/responsive.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/tabs',
    loadChildren: () => import('./layout/tabs-demo/tabs.lazy.module').then(mod => mod.LazyModule)
  }
];

/** Injection token to provide the element path modules. */
export const ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN = new InjectionToken<Map<string, LoadChildrenCallback>>('ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN');

export const ELEMENT_MODULE_LOAD_CALLBACKS = new Map<string, LoadChildrenCallback>();
ELEMENT_MODULE_LOAD_CALLBACKS_AS_ROUTES.forEach(route => {
  ELEMENT_MODULE_LOAD_CALLBACKS.set(route.path, route.loadChildren);
});
