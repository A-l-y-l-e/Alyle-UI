import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Injectable } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MinimalLSModule } from '@alyle/ui/ls';
import { LyDrawerModule } from '@alyle/ui/drawer';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { AlyleUIModule, LyCommonModule, LyThemeConfig, LY_THEME_CONFIG, LyHammerGestureConfig } from '@alyle/ui';
import { ResponsiveModule } from '@alyle/ui/responsive';
import { LyButtonModule } from '@alyle/ui/button';
import { LyRippleModule } from '@alyle/ui/ripple';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { RoutesAppService } from './components/routes-app.service';
import { PrismModule } from './core/prism/prism.module';
import { environment } from '@env/environment';
import { LyIconModule } from '@alyle/ui/icon';
import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { DefaultLight, DefaultDark } from '@alyle/ui/themes/default';

export class CustomDefaultLight extends DefaultLight {
  shadow = '#505050';
  codeColor = 'rgba(0, 23, 31, 0.7)';
  codeBg = '#F5F5F5';
  myColor = 'pink';
}

export class CustomDefaultDark extends DefaultDark {
  shadow = 'rgba(0, 0, 0, 1)';
  codeColor = '#efefef';
  codeBg = '#212121';
  myColor = 'teal';
}

/** Custom Theme */
export class MyCustomTheme extends LyThemeConfig {
  themes = [CustomDefaultLight, CustomDefaultDark];
}

const contrast = '#fff';
const typography = {
  fontFamily: `'Roboto', sans-serif`,
  fontSize: 14
};

const commonVariables = {
  iconButton: {
    size: '48px'
  },
  icon: {
    fontSize: '24px'
  },
  input: {
    /** default color */
    withColor: 'primary'
  }
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: '@alyle/ui'}),
    CommonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ResponsiveModule,
    MinimalLSModule,
    LyCommonModule,
    LyResizingCroppingImageModule,
    LyButtonModule,
    LyDrawerModule,
    LyToolbarModule,
    LyIconButtonModule,
    LyIconModule,
    LyMenuModule,
    LyRippleModule,
    PrismModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    RoutesAppService,
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig },
    { provide: LY_THEME_CONFIG, useClass: MyCustomTheme }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
