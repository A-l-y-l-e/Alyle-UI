import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class RoutesAppService {
  routesApp: { routes: any[], name: string }[];
  componentState: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
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
          { route: 'bg-color', name: 'bg & color' }
        ]
      },
      {
        name: 'Components',
        routes: [
          { route: 'button', name: 'Button' },
          { route: 'carousel', name: 'Carousel' },
          { route: 'drawer', name: 'Drawer' },
          { route: 'icon-button', name: 'Icon button' },
          { route: 'input', name: 'Input' },
          { route: 'menu', name: 'Menu' },
          { route: 'radio', name: 'Radio' },
          { route: 'resizing-cropping-images', name: 'Resizing & cropping' },
          { route: 'responsive', name: 'Responsive' },
          { route: 'ripple', name: 'Ripple' },
          { route: 'tabs', name: 'Tabs' }
        ]
      }
    ];
  }
}
