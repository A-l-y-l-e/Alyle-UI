import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoutesAppService {
  routesApp: { routes: any[], name: string, route: string }[];
  componentState: string;
  constructor( ) {
    this.routesApp = [
      {
        name: 'Getting Started',
        route: 'getting-started',
        routes: [
          { route: 'installation', name: 'Install' }
        ]
      },
      {
        name: 'Customization',
        route: 'customization',
        routes: [
          { route: 'dynamic-styles', name: 'Dynamic styles' },
          { route: 'theming', name: 'Theming' },
          { route: 'paper', name: 'Paper' },
          { route: 'multiple-themes', name: 'Multiple themes' }
        ]
      },
      {
        name: 'Layout',
        route: 'layout',
        routes: [
          { route: 'grid', name: 'Grid' },
          { route: 'responsive', name: 'Responsive' },
          { route: 'tabs', name: 'Tabs', status: 'alpha' }
        ]
      },
      {
        name: 'Components',
        route: 'components',
        routes: [
          { route: 'avatar', name: 'Avatar' },
          { route: 'badge', name: 'Badge' },
          { route: 'button', name: 'Button' },
          { route: 'card', name: 'Card' },
          { route: 'carousel', name: 'Carousel' },
          { route: 'checkbox', name: 'Checkbox' },
          { route: 'drawer', name: 'Drawer' },
          { route: 'field', name: 'Field' },
          { route: 'icon', name: 'Icon' },
          { route: 'menu', name: 'Menu' },
          { route: 'radio', name: 'Radio' },
          { route: 'resizing-cropping-images', name: 'Resizing & cropping' },
          { route: 'snack-bar', name: 'SnackBar' },
          { route: 'toolbar', name: 'Toolbar' },
          { route: 'tooltip', name: 'Tooltip' },
          { route: 'typography', name: 'Typography' }
        ]
      }
    ];
  }
}
