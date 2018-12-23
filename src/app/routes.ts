export const AUIRoutes = [
  {
    route: '',
    name: 'Alyle UI'
  },
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
      { route: 'tabs', name: 'Tabs' }
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
      { route: 'divider', name: 'Divider' },
      { route: 'drawer', name: 'Drawer' },
      { route: 'field', name: 'Field' },
      { route: 'icon', name: 'Icon' },
      { route: 'list', name: 'List' },
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

export const AUIRoutesMap = new Map();

AUIRoutes.forEach(item => {
  AUIRoutesMap.set(`/${item.route}`, item.name);
  if (item.routes) {
    for (let index = 0; index < item.routes.length; index++) {
      const route = item.routes[index];
      AUIRoutesMap.set(`/${item.route}/${route.route}`, item.name);
    }
  }
});
