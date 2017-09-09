import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class RoutesAppService {
  routesApp: { route: string, name: string }[];
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.routesApp = [
      { route: 'button', name: 'Button' },
      { route: 'input', name: 'Input' },
      { route: 'tabs', name: 'Tabs' },
      { route: 'radio', name: 'Radio' },
      { route: 'menu', name: 'Menu' },
      { route: 'resizing-cropping-images', name: 'Resizing & cropping images' },
      { route: 'carousel', name: 'Carousel' },
      { route: 'icon-button', name: 'Icon button' },
    ];
  }
  get componentState(): { route: string, name: string } {
    const routes = this.routesApp;
    let route: { route: string, name: string };
    let routeName: string;
    if (this.router.url !== '/components') {
      routeName = this.route.root.firstChild.firstChild.firstChild.routeConfig.path;
    }
    return routes.find((route) => route.route === routeName);
  }

}
