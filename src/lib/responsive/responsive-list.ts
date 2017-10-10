export class ResponsiveList {
  MinWidth?: string;
  queries?: any = {
    xs: {"max-width": '599px'},
    "gt-xs": {'min-width': '600px'},
    sm: {'min-width': '600px', 'max-width': '959px'},
    "gt-sm": {'min-width': '960px'},
    md: {'min-width': '960px', 'max-width': '1279px'},
    "gt-gm": {'min-width': '1280px'},
    lg: {'min-width': '1280px', 'max-width': '1919px'},
    "gt-lg": {'min-width': '1920px'},
    xl: {'min-width': '1920px'}
  };

}
