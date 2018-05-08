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
import { LyRippleModule } from '@alyle/ui/ripple';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { RoutesAppService } from './components/routes-app.service';
import { PrismModule } from './core/prism/prism.module';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { LyCommonModule } from '@alyle/ui';
import { environment } from '@env/environment';
import { LyIconModule } from '@alyle/ui/icon';

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
          '300': '#64b5f6'
        },
        accent: {
          default: '#ff4081'
        },
        scheme: 'light',
        purple_light: 'rgb(106, 36, 212)',
        colorSchemes: {
          light: {
            shadow: '#c0c0c0',
            codeColor: 'rgba(0, 23, 31, 0.7)',
            myColor: 'pink',
            others: {
              custom: '#00bcd4'
            }
          },
          dark: {
            shadow: 'rgba(0, 0, 0, 1)',
            codeColor: '#efefef',
            myColor: 'teal'
          },
          myCustomScheme: {
            background: {
              primary: '#000',
            },
            text: {
              default: '#fff'
            }
          }
        }
      }
    ),
    LyCommonModule,
    LyButtonModule,
    LyDrawerModule,
    LyToolbarModule,
    LyIconButtonModule,
    LyIconModule,
    LySvgModule,
    LyMenuModule,
    LyRippleModule,
    PrismModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [RoutesAppService, {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }
