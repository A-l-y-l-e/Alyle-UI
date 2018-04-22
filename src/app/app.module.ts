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
import { ThemeModule } from 'alyle-ui/core';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    'pan': {threshold: 0}
 };
}
const contrastText = '#fff';
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
      }
    },
    {
      pink: {
        default: '#ff4b73',
        contrastText
      },
      pinkLight: {
        default: '#f50057',
        contrastText
      },
      cyan: {
        default: '#00bcd4',
        contrastText
      },
      red: {
        default: '#FF5252',
        contrastText
      },
      amber: {
        default: '#ffc107',
        contrastText
      },
      teal: {
        default: '#009688',
        contrastText
      },
      purple: {
        default: '#ce30c9',
        contrastText
      },
      lightBlue: {
        default: '#03A9F4',
        contrastText
      },
      blue: {
        default: '#2196F3',
        contrastText
      },
      deepOrange: {
        default: '#FF5722',
        contrastText
      },
    }),
    ThemeModule,
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
