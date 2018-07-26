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
          { route: 'multiple-themes', name: 'Multiple themes' },
          { route: 'bg-color', name: 'bg & color' }
        ]
      },
      {
        name: 'Layout',
        route: 'layout',
        routes: [
          { route: 'grid', name: 'Grid' },
          { route: 'flex', name: 'Flex' },
          { route: 'responsive', name: 'Responsive' }
        ]
      },
      {
        name: 'Components',
        route: 'components',
        routes: [
          { route: 'button', name: 'Button' },
          { route: 'card', name: 'Card' },
          { route: 'carousel', name: 'Carousel' },
          { route: 'drawer', name: 'Drawer' },
          { route: 'icon-button', name: 'Icon button' },
          { route: 'input', name: 'Input' },
          { route: 'menu', name: 'Menu' },
          { route: 'radio', name: 'Radio' },
          { route: 'resizing-cropping-images', name: 'Resizing & cropping' },
          { route: 'ripple', name: 'Ripple' },
          { route: 'shadow', name: 'Shadow' },
          { route: 'tabs', name: 'Tabs' },
          { route: 'typography', name: 'Typography' },
        ]
      }
    ];
  }
}
