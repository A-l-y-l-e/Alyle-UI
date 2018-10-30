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
          { route: 'theming', name: 'Theming' },
          { route: 'bg-color', name: 'Bg & Color' },
          { route: 'dynamic-styles', name: 'Dynamic styles' },
          { route: 'multiple-themes', name: 'Multiple themes' },
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
          { route: 'badge', name: 'Badge' },
          { route: 'button', name: 'Button' },
          { route: 'card', name: 'Card' },
          { route: 'carousel', name: 'Carousel' },
          { route: 'drawer', name: 'Drawer' },
          { route: 'field', name: 'Field', status: 'alpha' },
          { route: 'icon-button', name: 'Icon button' },
          { route: 'menu', name: 'Menu', status: 'alpha' },
          { route: 'radio', name: 'Radio' },
          { route: 'resizing-cropping-images', name: 'Resizing & cropping' },
          { route: 'ripple', name: 'Ripple' },
          { route: 'shadow', name: 'Shadow' },
          { route: 'toolbar', name: 'Toolbar' },
          { route: 'typography', name: 'Typography' }
        ]
      }
    ];
  }
}
