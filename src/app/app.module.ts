import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Injectable } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { LyDrawerModule } from '@alyle/ui/drawer';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyCommonModule, LY_THEME, LY_THEME_GLOBAL_VARIABLES, RecursivePartial, LY_THEME_NAME, LyTheme2, lyl, StyleRenderer, LyHammerGestureConfig } from '@alyle/ui';
import { ResponsiveModule } from '@alyle/ui/responsive';
import { LyButtonModule } from '@alyle/ui/button';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { environment } from '@env/environment';
import { LyIconModule } from '@alyle/ui/icon';
import { MinimaLight, MinimaDark, MinimaDeepDark } from '@alyle/ui/themes/minima';
import { TitleComponent } from './document/title/title.component';
import { DemoViewModule } from './demo-view';
import { LyTypographyModule, LyTypographyTheme } from '@alyle/ui/typography';
import { LyCardModule } from '@alyle/ui/card';
import { AppBarComponent } from './app-bar/app-bar.component';
import { HomeComponent } from './home/home.component';
import { PageContentComponent } from './page-content/page-content.component';
import { LySnackBarModule } from '@alyle/ui/snack-bar';
import { LyTooltipModule } from '@alyle/ui/tooltip';
import { LyGridModule } from '@alyle/ui/grid';
import { RouterModule } from '@angular/router';
import { Color } from '@alyle/ui/color';
import { DocViewerModule } from './docs/docs-viewer.module';

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
  shadow = '#505050';
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
  snackBar = {
    root: lyl `{
      background: ${new Color(0x000000)}
      border-radius: 0
    }`
  };
}

@Injectable()
export class CustomMinimaDark {
  name = 'minima-dark';
  shadow = 'rgba(0, 0, 0, 1)';
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
}
@Injectable()
export class CustomMinimaDeepDark extends CustomMinimaDark {
  name = 'minima-deep-dark';
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

@NgModule({
  declarations: [
    AppComponent,
    PageContentComponent,
    AppBarComponent,
    TitleComponent,
    /** Pages */
    HomeComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    HammerModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    // LyThemeModule.setTheme('minima-light'),
    ResponsiveModule,
    LyCommonModule,
    LyButtonModule,
    LyDrawerModule,
    LyToolbarModule,
    LyIconModule,
    LyMenuModule,
    LyTypographyModule,
    LyCardModule,
    DemoViewModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    LySnackBarModule,
    LyTooltipModule,
    LyGridModule,
    DocViewerModule
  ],
  providers: [
    [ LyTheme2, StyleRenderer ],
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    { provide: LY_THEME, useClass: MinimaDark, multi: true },
    { provide: LY_THEME, useClass: MinimaDeepDark, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaLight, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaDark, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaDeepDark, multi: true },
    { provide: LY_THEME_GLOBAL_VARIABLES, useClass: GlobalVariables },
    { provide: LY_THEME_NAME, useFactory: themeNameProviderFactory },
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
