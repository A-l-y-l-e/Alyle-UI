import { Component } from '@angular/core';

@Component({
  selector: 'aui-installation',
  templateUrl: './installation.component.html',
  styleUrls: ['./installation.component.scss']
})
export class InstallationComponent {
  code: string;
  codeTheme = `<!-- app.component.ts -->
<div lyTheme="minima-light">
  Content
</div>
`;
  constructor() {
    this.code = `...
/** Angular */
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

/** Animations */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Core module & common module */
import {
  LyThemeModule,
  LyCommonModule,
  LY_THEME_CONFIG,
  LyHammerGestureConfig } from '@alyle/ui';

/** Import theme */
import { MinimaTheme } from '@alyle/ui/themes/minima';

@NgModule({
  ...
  imports: [
    ...
    BrowserModule,
    BrowserAnimationsModule,
    LyThemeModule.setTheme('minima-dark'),
    LyCommonModule // for bg, color, raised, button and other components
    ...
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig }, // Gestures for cropping & carousel
    { provide: LY_THEME_CONFIG, useClass: MinimaTheme } // Theme
  ]
  ...
})
export class AppModule { }`;
  }

  toJson(val: any) {
    // /** Custom theme */
    // const configAlyleUI = ${this.toJson(this.palette)};
    val = JSON.stringify(val, undefined, 2);
    val = (<string>val).replace(/\s\s\"/g, '  ');
    return (<string>val).replace(/\"\:\s/g, ': ');
  }

}
