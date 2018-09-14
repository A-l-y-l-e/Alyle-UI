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
