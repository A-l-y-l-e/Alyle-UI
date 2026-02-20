import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { APP_ID, ApplicationConfig, Injectable, isDevMode, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { HAMMER_GESTURE_CONFIG, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import {
  LY_THEME,
  LY_THEME_GLOBAL_VARIABLES,
  RecursivePartial,
  LY_THEME_NAME,
  LyTheme2,
  lyl,
  StyleRenderer,
  LyHammerGestureConfig,
  LyClasses,
  LY_ENABLE_SELECTORS_FN
} from '@alyle/ui';
import { Color } from '@alyle/ui/color';
import { MinimaDark, MinimaDeepDark, MinimaLight } from '@alyle/ui/themes/minima';
import { LyTypographyTheme } from '@alyle/ui/typography';
import { AnalyticsService, windowProvider, WindowToken } from '@shared/analytics.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { STYLES as DEMO_VIEWER_STYLES } from './demo-view';
import { provideServiceWorker } from '@angular/service-worker';

const Quepal = {
  default: `linear-gradient(135deg,#11998e 0%,#38ef7d 100%)`,
  contrast: new Color(0xffffff),
  shadow: new Color(0x11998e)
};
const SublimeLight = {
  default: `linear-gradient(135deg,#FC5C7D 0%,#6A82FB 100%)`,
  contrast: new Color(0xffffff),
  shadow: new Color(0xB36FBC)
};

@Injectable()
export class CustomMinimaLight {
  name = 'minima-light';
  // shadow = '#505050';
  codeColor = 'rgba(0, 23, 31, 0.7)';
  codeBg = '#ffffff';
  myColor = 'pink';
  discord = '#7289DA';
  drawerButton = '#5f6368';
  demoBg = new Color(0x8c8c8c);
  prism = {
    colorText: '#626682',
    string: '#27b98f',
    keyword: '#7c4dff'
  };
  stackblitz = '#1389FD';
  // snackBar = {
  //   root: lyl `{
  //     background: ${new Color(0x000000)}
  //     border-radius: 0
  //   }`
  // };
}

@Injectable()
export class CustomMinimaDark {
  name = 'minima-dark';
  // shadow = 'rgba(0, 0, 0, 1)';
  codeColor = '#efefef';
  codeBg = new Color(0x1b1b1b);
  myColor = 'teal';
  discord = '#fff';
  drawerButton = '#abafb5';
  demoBg = new Color();
  prism = {
    colorText: '#ebebef',
    string: '#89b72c',
    keyword: '#3cd2ad'
  };
  stackblitz = '#fff';
  demoViewer: ((__: LyClasses<typeof DEMO_VIEWER_STYLES>)
    => (className: string) => string) | null = null;
}
@Injectable()
export class CustomMinimaDeepDark extends CustomMinimaDark {
  name = 'minima-deep-dark';
  demoViewer = (__: LyClasses<typeof DEMO_VIEWER_STYLES>) => lyl `{
    > div {
      box-shadow: 0px 0px 0px 2px #353535
      border-radius: 9px
      overflow: hidden
      background: none
    }
  }`
}

@Injectable()
export class GlobalVariables implements RecursivePartial<MinimaLight & MinimaDark> {
  testVal = '#00bcd4';
  Quepal = Quepal;
  SublimeLight = SublimeLight;
  Amber = {
    default: '#ffc107',
    contrast: 'rgba(0, 0, 0, 0.87)'
  };
  transparent = new Color(0, 0, 0, 0);
  typography: LyTypographyTheme = {
    lyTyp: {
      subTitle: () => lyl `{
        font-family: 'Roboto', sans-serif
        text-align: center
        padding-above: 1em
        opacity: .6
        font-size: 32px
        font-weight: 400
      }`
    }
  };
}

export type AUIThemeVariables = MinimaLight & MinimaDark & CustomMinimaLight & CustomMinimaDark & GlobalVariables;

export function themeNameProviderFactory() {
  if (typeof localStorage === 'object') {
    const themeName = localStorage.getItem('theme-name');
    if (themeName) {
      return themeName;
    }
  }
  return 'minima-light';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideNoopAnimations(),
    AnalyticsService,
    [ LyTheme2, StyleRenderer ],
    { provide: APP_ID, useValue: 'serverApp' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    { provide: LY_THEME, useClass: MinimaDark, multi: true },
    { provide: LY_THEME, useClass: MinimaDeepDark, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaLight, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaDark, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaDeepDark, multi: true },
    { provide: LY_THEME_GLOBAL_VARIABLES, useClass: GlobalVariables },
    { provide: LY_THEME_NAME, useFactory: themeNameProviderFactory },
    { provide: LY_ENABLE_SELECTORS_FN, useValue: true }, // default true
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig },
    { provide: WindowToken, useFactory: windowProvider },
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes,
      // Restore scroll position
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      }),
      // Start navigation before root component is created (replaces initialNavigation: 'enabledBlocking')
      // withEnabledBlockingInitialNavigation()
    ),
    provideClientHydration(withEventReplay()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
