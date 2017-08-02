import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

// import { MinimalLSModule } from 'alyle-ui';
import { MinimalLSModule } from 'alyle-ui/ls';
import { LyDrawerModule } from 'alyle-ui/drawer';
import { LyToolbarModule } from 'alyle-ui/toolbar';
import { LySvgModule } from 'alyle-ui/svg';
import { LyMenuModule } from 'alyle-ui/menu';
import { LyIconButtonModule } from 'alyle-ui/icon-button';
import {
  AlyleUIModule,
  LyShadowModule,
} from 'alyle-ui';
import { ResponsiveModule, ResponsiveService } from 'alyle-ui/responsive';
import { LyButtonModule } from 'alyle-ui/button';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { RoutesAppService } from './components/routes-app.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    ResponsiveModule.forRoot({
      // MinWidth: '720',
      // oneM: {"min-width": 720}
    }),
    MinimalLSModule, // Beta
    AlyleUIModule.forRoot({
      primary: 'blue',
      accent: 'pink',
      other: 'red',
    }),
    LyButtonModule,
    LyDrawerModule,
    LyShadowModule,
    LyToolbarModule,
    LyIconButtonModule,
    LySvgModule,
    LyMenuModule,
    AppRoutingModule
  ],
  providers: [RoutesAppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
