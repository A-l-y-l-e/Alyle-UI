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
  },
  {
    path: '/components/avatar',
    loadChildren: () => import('./components/avatar-demo/avatar.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/dadge',
    loadChildren: () => import('./components/badge-demo/badge.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/button',
    loadChildren: () => import('./components/button-demo/button.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/card',
    loadChildren: () => import('./components/card-demo/card.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/carousel',
    loadChildren: () => import('./components/carousel-demo/carousel.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/checkbox',
    loadChildren: () => import('./components/checkbox-demo/checkbox.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/dialog',
    loadChildren: () => import('./components/dialog-demo/dialog.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/divider',
    loadChildren: () => import('./components/divider-demo/divider.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/drawer',
    loadChildren: () => import('./components/drawer-demo/drawer.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/expansion',
    loadChildren: () => import('./components/expansion-demo/expansion.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/field',
    loadChildren: () => import('./components/field-demo/field.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/icon',
    loadChildren: () => import('./components/icon-demo/icon.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/image-cropper',
    loadChildren: () => import('./components/image-cropper-demo/image-cropper.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/list',
    loadChildren: () => import('./components/list-demo/list.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/menu',
    loadChildren: () => import('./components/menu-demo/menu.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/radio',
    loadChildren: () => import('./components/radio-demo/radio.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/select',
    loadChildren: () => import('./components/select-demo/select.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/slider',
    loadChildren: () => import('./components/slider-demo/slider.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/snack-bar',
    loadChildren: () => import('./components/snack-bar-demo/snack-bar.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/toolbar',
    loadChildren: () => import('./components/toolbar-demo/toolbar.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/toolbar',
    loadChildren: () => import('./components/toolbar-demo/toolbar.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/tooltip',
    loadChildren: () => import('./components/tooltip-demo/tooltip.lazy.module').then(mod => mod.LazyModule)
  },
  {
    path: '/components/typography',
    loadChildren: () => import('./components/typography-demo/typography.lazy.module').then(mod => mod.LazyModule)
  }
];

/** Injection token to provide the element path modules. */
export const ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN = new InjectionToken<Map<string, LoadChildrenCallback>>('ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN');

export const ELEMENT_MODULE_LOAD_CALLBACKS = new Map<string, LoadChildrenCallback>();
ELEMENT_MODULE_LOAD_CALLBACKS_AS_ROUTES.forEach(route => {
  ELEMENT_MODULE_LOAD_CALLBACKS.set(route.path, route.loadChildren);
});
