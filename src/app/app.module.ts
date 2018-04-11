import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Injectable } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MinimalLSModule } from 'alyle-ui/ls';
import { LyDrawerModule } from 'alyle-ui/drawer';
import { LyToolbarModule } from 'alyle-ui/toolbar';
import { LySvgModule } from 'alyle-ui/svg';
import { LyMenuModule } from 'alyle-ui/menu';
import { LyIconButtonModule } from 'alyle-ui/icon-button';
import { AlyleUIModule } from 'alyle-ui';
import { ResponsiveModule } from 'alyle-ui/responsive';
import { LyButtonModule } from 'alyle-ui/button';
import { LyShadowModule } from 'alyle-ui/shadow';
import { LyRippleModule } from 'alyle-ui/ripple-minimal';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { RoutesAppService } from './components/routes-app.service';
import { PrismModule } from './core/prism/prism.module';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    'pan': {threshold: 0}
 };
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'alyle-ui'}),
    CommonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ResponsiveModule,
    MinimalLSModule,
    AlyleUIModule.forRoot({
      primary: 'blue',
      accent: 'pink',
      other: 'red',
      colorScheme: 'light',
      variables: {
        purple_light: 'rgb(106, 36, 212)'
      },
      schemes: {
        light: {
          shadow: 'rgba(0, 0, 0, 0.1111)',
          myColor: 'pink',
          others: {
            custom: '#00bcd4'
          }
        },
        dark: {
          shadow: '#252525',
          myColor: 'teal'
        }
      },
      palette: {
        'pink': {
          // '500': '#ff4b73',
          // contrast: 'light',
          default: '#ff4b73'
        },
        'pinkLight': {
          // '500': '#f50057',
          // contrast: 'light',
          default: '#f50057'
        },
        'cyan': {
          // '500': '#00bcd4',
          // contrast: 'light',
          default: '#00bcd4'
        },
        'red': {
          // '500': '#FF5252',
          // contrast: 'light',
          default: '#FF5252'
        },
        'amber': {
          // '500': '#ffc107',
          // contrast: 'dark',
          default: '#ffc107'
        },
        'teal': {
          // '500': '#009688',
          // contrast: 'light',
          default: '#009688'
        },
        'purple': {
          // '500': '#ce30c9',
          // contrast: 'light',
          default: '#ce30c9'
        },
        'lightBlue': {
          // '500': '#03A9F4',
          // contrast: 'light',
          default: '#03A9F4'
        },
        'blue': {
          // '500': '#2196F3',
          // contrast: 'light',
          default: '#2196F3'
        },
        'deepOrange': {
          // '500': '#FF5722',
          // contrast: 'light',
          default: '#FF5722'
        },
      }
    }),
    LyButtonModule,
    LyDrawerModule,
    LyShadowModule,
    LyToolbarModule,
    LyIconButtonModule,
    LySvgModule,
    LyMenuModule,
    LyRippleModule,
    PrismModule,
    AppRoutingModule
  ],
  providers: [RoutesAppService, {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }
