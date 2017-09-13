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
          { route: 'input', name: 'Input' },
          { route: 'tabs', name: 'Tabs' },
          { route: 'radio', name: 'Radio' },
          { route: 'menu', name: 'Menu' },
          { route: 'resizing-cropping-images', name: 'Resizing & cropping images' },
          { route: 'carousel', name: 'Carousel' },
          { route: 'icon-button', name: 'Icon button' }
        ]
      }
    ];
  }
}
