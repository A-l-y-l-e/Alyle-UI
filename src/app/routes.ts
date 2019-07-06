function sort(a: any, b: any) {
  return a.route > b.route ? 1 : a.route < b.route ? -1 : 0;
}

export const AUIRoutes: {
  route: string
  name: string
  routes?: {
    route: string
    name: string
    api?: boolean
  }[]
}[] = [
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
      { route: 'theming-components', name: 'Theming Components' },
      { route: 'paper', name: 'Paper' },
      { route: 'multiple-themes', name: 'Multiple themes' }
    ]
  },
  {
    name: 'Layout',
    route: 'components',
    routes: [
      { route: 'grid', api: true , name: 'Grid' },
      { route: 'responsive', api: true , name: 'Responsive' },
      { route: 'tabs', api: true , name: 'Tabs' }
    ].sort(sort)
  },
  {
    name: 'Guides',
    route: 'guides',
    routes: [
      { route: 'lazy-loading' , name: 'Lazy Loading'}
    ].sort(sort)
  },
  {
    name: 'Components',
    route: 'components',
    routes: [
      { route: 'avatar', api: true , name: 'Avatar'},
      { route: 'badge', api: true , name: 'Badge' },
      { route: 'button', api: true , name: 'Button' },
      { route: 'card', api: true , name: 'Card' },
      { route: 'carousel', api: true , name: 'Carousel' },
      { route: 'checkbox', api: true , name: 'Checkbox' },
      { route: 'divider', api: true , name: 'Divider' },
      { route: 'drawer', api: true , name: 'Drawer' },
      { route: 'field', api: true , name: 'Field' },
      { route: 'icon', api: true , name: 'Icon' },
      { route: 'list', api: true , name: 'List' },
      { route: 'menu', api: true , name: 'Menu' },
      { route: 'radio', api: true , name: 'Radio' },
      { route: 'resizing-cropping-images', api: true , name: 'Resizing & cropping' },
      { route: 'snack-bar', api: true , name: 'SnackBar' },
      { route: 'toolbar', api: true , name: 'Toolbar' },
      { route: 'tooltip', api: true , name: 'Tooltip' },
      { route: 'typography', api: true , name: 'Typography' },
      { route: 'select', api: true , name: 'Select' },
      { route: 'dialog', api: true , name: 'Dialog' },
      { route: 'expansion', api: true , name: 'Expansion Panel' },
      { route: 'slider', api: true , name: 'Slider' }
    ].sort(sort)
  }
];

export const AUIRoutesMap = new Map<string, {
  route: string;
  name: string;
  api?: boolean;
}>();

AUIRoutes.forEach(item => {
  AUIRoutesMap.set(`/${item.route}`, item);
  if (item.routes) {
    for (let index = 0; index < item.routes.length; index++) {
      const route = item.routes[index];
      AUIRoutesMap.set(`/${item.route}/${route.route}`, route);
      if (route.api) {
        AUIRoutesMap.set(`/api/${route.route}`, { ...route, api: undefined });
      }
    }
  }
});
