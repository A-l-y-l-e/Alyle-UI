import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { MinimalLSModule } from 'alyle-ui/ls';
import { LyDrawerModule } from 'alyle-ui/drawer';
import { LyToolbarModule } from 'alyle-ui/toolbar';
import { LySvgModule } from 'alyle-ui/svg';
import { LyMenuModule } from 'alyle-ui/menu';
import { LyIconButtonModule } from 'alyle-ui/icon-button';
import { AlyleUIModule } from 'alyle-ui';
import { ResponsiveModule, ResponsiveService } from 'alyle-ui/responsive';
import { LyButtonModule } from 'alyle-ui/button';
import { LyShadowModule } from 'alyle-ui/shadow';
import { LyRippleModule } from 'alyle-ui/ripple';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { RoutesAppService } from './components/routes-app.service';
import { PrismModule } from './core/prism/prism.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    ResponsiveModule,
    MinimalLSModule,
    AlyleUIModule.forRoot({
      primary: 'blue',
      accent: 'pink',
      other: 'red',
      colorScheme: 'light',
      schemes: {
        light: {
          shadow: 'rgba(0, 0, 0, 0.1111)',
          myColor: 'pink'
        },
        dark: {
          shadow: '#252525',
          myColor: 'teal'
        }
      },
      palette: {
        'pink': {
          color: { '500': '#ff4b73' },
          contrast: 'light'
        },
        'pinkLight': {
          color: { '500': '#f50057' },
          contrast: 'light'
        },
        'cyan': {
          color: { '500': '#00bcd4' },
          contrast: 'light'
        },
        'red': {
          color: { '500': '#FF5252' },
          contrast: 'light'
        },
        'amber': {
          color: { '500': '#ffc107' },
          contrast: 'dark'
        },
        'teal': {
          color: { '500': '#009688' },
          contrast: 'light'
        },
        'purple': {
          color: { '500': '#ce30c9' },
          contrast: 'light'
        },
        'lightBlue': {
          color: { '500': '#03A9F4' },
          contrast: 'light'
        },
        'blue': {
          color: { '500': '#2196F3' },
          contrast: 'light'
        },
        'deepOrange': {
          color: { '500': '#FF5722' },
          contrast: 'light'
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
  providers: [RoutesAppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
