import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { LyDrawerModule } from '@alyle/ui/drawer';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { LyCommonModule, LyThemeConfig, LY_THEME_CONFIG, LyHammerGestureConfig, LyThemeModule, ThemeVariables } from '@alyle/ui';
import { ResponsiveModule, Breakpoints } from '@alyle/ui/responsive';
import { LyButtonModule } from '@alyle/ui/button';
import { LyRippleModule } from '@alyle/ui/ripple';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { RoutesAppService } from './components/routes-app.service';
import { PrismModule } from './core/prism/prism.module';
import { environment } from '@env/environment';
import { LyIconModule } from '@alyle/ui/icon';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { ResponsiveDemoModule } from './components/responsive-demo/responsive-demo.module';
import { TitleComponent } from './document/title/title.component';
import { DemoViewModule } from './demo-view';
import { InstallationComponent } from '@docs/getting-started/installation/installation.component';
import { CardDemoComponent } from '@docs/components/card-demo/card-demo.component';
import { CardDemoBasicModule } from '@docs/components/card-demo/card-demo-basic/card-demo-basic.module';
import { LyTypographyModule } from '@alyle/ui/typography';
import { TypographyDemoComponent } from '@docs/components/typography-demo/typography-demo.component';
import { TypographyDemoBasicModule } from '@docs/components/typography-demo/typography-demo-basic/typography-demo-basic.module';
import { MultipleThemesComponent } from './components/multiple-themes/multiple-themes.component';
import { MultipleThemesDemo01Module } from './components/multiple-themes/multiple-themes-demo-01/multiple-themes-demo-01.module';
import { DocsModule } from '@docs/docs.module';
import { LyTabsModule } from '@alyle/ui/tabs';
import { ApiComponent } from './api/api.component';
import { LyCardModule } from '@alyle/ui/card';
import { AppBarComponent } from './app-bar/app-bar.component';

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

export class CustomMinimaLight extends MinimaLight {
  shadow = '#505050';
  codeColor = 'rgba(0, 23, 31, 0.7)';
  codeBg = '#F5F5F5';
  myColor = 'pink';
}

export class CustomMinimaDark extends MinimaDark {
  shadow = 'rgba(0, 0, 0, 1)';
  codeColor = '#efefef';
  codeBg = '#212121';
  myColor = 'teal';
}

export class GlobalVariables implements ThemeVariables {
  testVal = '#00bcd4';
  Quepal = Quepal;
  SublimeLight = SublimeLight;
  breakpoints = Breakpoints;
}

/** Custom Theme */
export class MyCustomTheme implements LyThemeConfig {
  themes = [
    CustomMinimaLight,
    CustomMinimaDark
  ];
  variables = GlobalVariables;
}

@NgModule({
  declarations: [
    AppComponent,
    AppBarComponent,
    ApiComponent,
    TitleComponent,
    /** Customization */
    MultipleThemesComponent,
    /** Getting started */
    InstallationComponent,
    /** Components */
    CardDemoComponent,
    TypographyDemoComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: '@alyle/ui'}),
    /** Customization */
    /** MultipleThemes >*/MultipleThemesDemo01Module,
    /** Layout */
    ResponsiveDemoModule,
    /** CardDemo > */CardDemoBasicModule,
    /** TypographyDemo > */TypographyDemoBasicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LyThemeModule.setTheme('minima-light'),
    ResponsiveModule,
    LyCommonModule,
    LyButtonModule,
    LyDrawerModule,
    LyToolbarModule,
    LyIconButtonModule,
    LyIconModule,
    LyMenuModule,
    LyRippleModule,
    LyTypographyModule,
    LyCardModule,
    PrismModule,
    DemoViewModule,
    DocsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    LyTabsModule
  ],
  providers: [
    RoutesAppService,
    { provide: LY_THEME_CONFIG, useClass: MyCustomTheme },
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
