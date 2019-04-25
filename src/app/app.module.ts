import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { LyDrawerModule } from '@alyle/ui/drawer';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyCommonModule, LY_THEME, LY_THEME_GLOBAL_VARIABLES, PartialThemeVariables, LY_THEME_NAME, LyTheme2 } from '@alyle/ui';
import { ResponsiveModule } from '@alyle/ui/responsive';
import { LyButtonModule } from '@alyle/ui/button';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { PrismModule } from './core/prism/prism.module';
import { environment } from '@env/environment';
import { LyIconModule } from '@alyle/ui/icon';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { TitleComponent } from './document/title/title.component';
import { DemoViewModule } from './demo-view';
import { InstallationComponent } from '@docs/getting-started/installation/installation.component';
import { CardDemoComponent } from '@docs/components/card-demo/card-demo.component';
import { CardDemoBasicModule } from '@docs/components/card-demo/card-demo-basic/card-demo-basic.module';
import { LyTypographyModule } from '@alyle/ui/typography';
import { MultipleThemesComponent } from './components/multiple-themes/multiple-themes.component';
import { MultipleThemesDemo01Module } from './components/multiple-themes/multiple-themes-demo-01/multiple-themes-demo-01.module';
import { DocsModule } from '@docs/docs.module';
import { LyTabsModule } from '@alyle/ui/tabs';
import { ApiComponent } from './api/api.component';
import { LyCardModule } from '@alyle/ui/card';
import { AppBarComponent } from './app-bar/app-bar.component';
import { HomeComponent } from './home/home.component';
import { PageContentComponent } from './page-content/page-content.component';
import { LySnackBarModule } from '@alyle/ui/snack-bar';
import { LyTooltipModule } from '@alyle/ui/tooltip';
import { LyGridModule } from '@alyle/ui/grid';

const Quepal = {
  default: `linear-gradient(135deg,#11998e 0%,#38ef7d 100%)`,
  contrast: '#fff',
  shadow: '#11998e'
};
const SublimeLight = {
  default: `linear-gradient(135deg,#FC5C7D 0%,#6A82FB 100%)`,
  contrast: '#fff',
  shadow: '#B36FBC'
};

export class CustomMinimaLight {
  name = 'minima-light';
  shadow = '#505050';
  codeColor = 'rgba(0, 23, 31, 0.7)';
  codeBg = '#fff';
  myColor = 'pink';
  discord = '#7289DA';
  drawerButton = '#5f6368';
  demoBg = '#c7c7c7';
  prism = {
    colorText: '#626682',
    string: '#27b98f',
    keyword: '#7c4dff'
  };
}

export class CustomMinimaDark {
  name = 'minima-dark';
  shadow = 'rgba(0, 0, 0, 1)';
  codeColor = '#efefef';
  codeBg = '#1b1b1b';
  myColor = 'teal';
  discord = '#fff';
  drawerButton = '#abafb5';
  demoBg = '#070707';
  prism = {
    colorText: '#ebebef',
    string: '#89b72c',
    keyword: '#3cd2ad'
  };
}

export class GlobalVariables implements PartialThemeVariables {
  testVal = '#00bcd4';
  Quepal = Quepal;
  SublimeLight = SublimeLight;
  Amber = {
    default: '#ffc107',
    contrast: 'rgba(0, 0, 0, 0.87)'
  };
  transparent = 'rgba(0, 0, 0, 0)';
  typography = {
    lyTyp: {
      subTitle: {
        fontFamily: `'Nunito', sans-serif`,
        textAlign: 'center',
        paddingAbove: '1em',
        opacity: .6,
        fontSize: '32px',
        fontWeight: 400
      }
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
    ApiComponent,
    TitleComponent,
    /** Customization */
    MultipleThemesComponent,
    /** Getting started */
    InstallationComponent,
    /** Components */
    CardDemoComponent,
    /** Pages */
    HomeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: '@alyle/ui'}),
    /** Customization */
    /** MultipleThemes >*/MultipleThemesDemo01Module,
    /** CardDemo > */CardDemoBasicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
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
    PrismModule,
    DemoViewModule,
    DocsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    LyTabsModule,
    LySnackBarModule,
    LyTooltipModule,
    LyGridModule
  ],
  providers: [
    [ LyTheme2 ],
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    { provide: LY_THEME, useClass: MinimaDark, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaLight, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaDark, multi: true },
    { provide: LY_THEME_GLOBAL_VARIABLES, useClass: GlobalVariables },
    { provide: LY_THEME_NAME, useFactory: themeNameProviderFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
