import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LY_THEME, LY_THEME_NAME, StyleRenderer, LyTheme2, LyCommonModule, LyClasses, lyl } from '@alyle/ui';
import { MinimaLight, MinimaDeepDark, MinimaDark } from '@alyle/ui/themes/minima';

// importExampleModule
import { AppComponent, STYLES as APP_STYLES } from './app.component';
import { AppBarModule } from './app-bar/app-bar.module';
import { Color } from '@alyle/ui/color';

@Injectable()
export class CustomMinimaLight {
  name = 'minima-light';
  demoBg = new Color(0x8c8c8c);
}

@Injectable()
export class CustomMinimaDark {
  name = 'minima-dark';
  demoBg = new Color(); // Black
  exampleContainer: ((__: LyClasses<typeof APP_STYLES>)
    => (className: string) => string) | null = null;
}

@Injectable()
export class CustomMinimaDeepDark extends CustomMinimaDark {
  override name = 'minima-deep-dark';
  override exampleContainer = (__: LyClasses<typeof APP_STYLES>) => lyl `{
    ${__.exampleContainer} {
      box-shadow: 0px 0px 0px 2px #353535
      border-radius: 9px
      overflow: hidden
      background: none
    }
  }`
}

export type AppThemeVariables = MinimaLight
& MinimaDark
& CustomMinimaLight
& CustomMinimaDark;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    LyCommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppBarModule,
    // ExampleModule
  ],
  providers: [
    StyleRenderer,
    LyTheme2,
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    { provide: LY_THEME, useClass: MinimaDeepDark, multi: true },
    { provide: LY_THEME, useClass: MinimaDark, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaLight, multi: true }, // name minima-light
    { provide: LY_THEME, useClass: CustomMinimaDark, multi: true }, // name minima-dark
    { provide: LY_THEME, useClass: CustomMinimaDeepDark, multi: true }, // name minima-deep-dark
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
