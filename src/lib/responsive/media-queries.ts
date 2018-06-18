export const Breakpoints = {
  XSmall: 'screen and (max-width: 599px)',
  Small: 'screen and (min-width: 600px) and (max-width: 959px)',
  Medium: 'screen and (min-width: 960px) and (max-width: 1279px)',
  Large: 'screen and (min-width: 1280px) and (max-width: 1919px)',
  XLarge: 'screen and (min-width: 1920px)',

  Handset: 'screen and (max-width: 599px) and (orientation: portrait), ' +
           'screen and (max-width: 959px) and (orientation: landscape)',
  Tablet: 'screen and (min-width: 600px) and (max-width: 839px) and (orientation: portrait), ' +
          'screen and (min-width: 960px) and (max-width: 1279px) and (orientation: landscape)',
  Web: 'screen and (min-width: 840px) and (orientation: portrait), ' +
       'screen and (min-width: 1280px) and (orientation: landscape)',

  HandsetPortrait: 'screen and (max-width: 599px) and (orientation: portrait)',
  TabletPortrait: 'screen and (min-width: 600px) and (max-width: 839px) and (orientation: portrait)',
  WebPortrait: 'screen and (min-width: 840px) and (orientation: portrait)',

  HandsetLandscape: 'screen and (max-width: 959px) and (orientation: landscape)',
  TabletLandscape: 'screen and (min-width: 960px) and (max-width: 1279px) and (orientation: landscape)',
  WebLandscape: 'screen and (min-width: 1280px) and (orientation: landscape)',
};

export const MediaQueries = {
  'xs': 'screen and (max-width: 599px)',
  'sm': 'screen and (min-width: 600px) and (max-width: 959px)',
  'md': 'screen and (min-width: 960px) and (max-width: 1279px)',
  'lg': 'screen and (min-width: 1280px) and (max-width: 1919px)',
  'xl': 'screen and (min-width: 1920px) and (max-width: 5000px)',
  'lt-sm': 'screen and (max-width: 599px)',
  'lt-md': 'screen and (max-width: 959px)',
  'lt-lg': 'screen and (max-width: 1279px)',
  'lt-xl': 'screen and (max-width: 1919px)',
  'gt-xs': 'screen and (min-width: 600px)',
  'gt-sm': 'screen and (min-width: 960px)',
  'gt-md': 'screen and (min-width: 1280px)',
  'gt-lg': 'screen and (min-width: 1920px)'
};
