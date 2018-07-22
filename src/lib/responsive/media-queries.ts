export const Breakpoints = {
  XSmall: '(max-width: 599px)',
  Small: '(min-width: 600px) and (max-width: 959px)',
  Medium: '(min-width: 960px) and (max-width: 1279px)',
  Large: '(min-width: 1280px) and (max-width: 1919px)',
  XLarge: '(min-width: 1920px)',

  Handset: '(max-width: 599px) and (orientation: portrait), ' +
           '(max-width: 959px) and (orientation: landscape)',
  Tablet: '(min-width: 600px) and (max-width: 839px) and (orientation: portrait), ' +
          '(min-width: 960px) and (max-width: 1279px) and (orientation: landscape)',
  Web: '(min-width: 840px) and (orientation: portrait), ' +
       '(min-width: 1280px) and (orientation: landscape)',

  HandsetPortrait: '(max-width: 599px) and (orientation: portrait)',
  TabletPortrait: '(min-width: 600px) and (max-width: 839px) and (orientation: portrait)',
  WebPortrait: '(min-width: 840px) and (orientation: portrait)',

  HandsetLandscape: '(max-width: 959px) and (orientation: landscape)',
  TabletLandscape: '(min-width: 960px) and (max-width: 1279px) and (orientation: landscape)',
  WebLandscape: '(min-width: 1280px) and (orientation: landscape)',
};

export const MediaQueries = {
  'xs': '(max-width: 599px)',
  'sm': '(min-width: 600px) and (max-width: 959px)',
  'md': '(min-width: 960px) and (max-width: 1279px)',
  'lg': '(min-width: 1280px) and (max-width: 1919px)',
  'xl': '(min-width: 1920px) and (max-width: 5000px)',
  'lt-sm': '(max-width: 599px)',
  'lt-md': '(max-width: 959px)',
  'lt-lg': '(max-width: 1279px)',
  'lt-xl': '(max-width: 1919px)',
  'gt-xs': '(min-width: 600px)',
  'gt-sm': '(min-width: 960px)',
  'gt-md': '(min-width: 1280px)',
  'gt-lg': '(min-width: 1920px)'
};
