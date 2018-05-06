import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoutesAppService {
  routesApp: { routes: any[], name: string }[];
  componentState: string;
  constructor( ) {
    this.routesApp = [
      {
        name: 'Get Started',
        routes: [
          { route: 'get-started', name: 'Install' },
        ]
      },
      {
        name: 'Customization',
        routes: [
          { route: 'theming', name: 'Theming' },
          { route: 'multiple-themes', name: 'Multiple themes' },
          { route: 'bg-color', name: 'bg & color' }
        ]
      },
      {
        name: 'Components',
        routes: [
          { route: 'button', name: 'Button' },
          { route: 'carousel', name: 'Carousel' },
          // { route: 'date-picker', name: 'Date picker' },
          { route: 'drawer', name: 'Drawer' },
          { route: 'icon-button', name: 'Icon button' },
          { route: 'input', name: 'Input' },
          { route: 'menu', name: 'Menu' },
          { route: 'radio', name: 'Radio' },
          { route: 'resizing-cropping-images', name: 'Resizing & cropping' },
          { route: 'responsive', name: 'Responsive' },
          { route: 'ripple', name: 'Ripple' },
          { route: 'shadow', name: 'Shadow' },
          { route: 'tabs', name: 'Tabs' }
        ]
      }
    ];
  }
}
