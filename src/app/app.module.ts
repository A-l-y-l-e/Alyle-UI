import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Injectable } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MinimalLSModule } from '@alyle/ui/ls';
import { LyDrawerModule } from '@alyle/ui/drawer';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LySvgModule } from '@alyle/ui/svg';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { AlyleUIModule } from '@alyle/ui';
import { ResponsiveModule } from '@alyle/ui/responsive';
import { LyButtonModule } from '@alyle/ui/button';
import { LyShadowModule } from '@alyle/ui/shadow';
import { LyRippleModule } from '@alyle/ui/ripple';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { RoutesAppService } from './components/routes-app.service';
import { PrismModule } from './core/prism/prism.module';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { ThemeModule } from '@alyle/ui';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    'pan': {threshold: 0}
 };
}

const contrast = '#fff';

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
    AlyleUIModule.forRoot(
      {
        name: 'RootTheme',
        primary: {
          300: '#64b5f6'
        },
        accent: {
          default: '#ff4081'
        },
        // accent: 'pink',
        // other: 'red',
        scheme: 'light',
        purple_light: 'rgb(106, 36, 212)',
        colorSchemes: {
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
          },
          myCustomScheme: {
            background: {
              paper: '#000',
            },
            text: {
              default: '#fff'
            }
          }
        }
      }
      // ,
      // {
      //   pink: {
      //     default: '#ff4b73',
      //     contrast
      //   },
      //   pinkLight: {
      //     default: '#f50057',
      //     contrast
      //   },
      //   cyan: {
      //     default: '#00bcd4',
      //     contrast
      //   },
      //   red: {
      //     default: '#FF5252',
      //     contrast
      //   },
      //   amber: {
      //     default: '#ffc107',
      //     contrast
      //   },
      //   teal: {
      //     default: '#009688',
      //     contrast
      //   },
      //   purple: {
      //     default: '#ce30c9',
      //     contrast
      //   },
      //   lightBlue: {
      //     default: '#03A9F4',
      //     contrast
      //   },
      //   blue: {
      //     default: '#2196F3',
      //     contrast
      //   },
      //   deepOrange: {
      //     default: '#FF5722',
      //     contrast
      //   },
      // }
    ),
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
