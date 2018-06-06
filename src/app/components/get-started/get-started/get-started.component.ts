import { Component, OnInit, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import { LyTheme } from '@alyle/ui';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetStartedComponent implements OnInit {
  code: string;
  constructor() {
    this.code = `...
/** Angular */
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

/** Animations */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Core module & common module */
import {
  AlyleUIModule,
  LyCommonModule,
  LyThemeConfig,
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
    LyCommonModule // for bg, color, raised, button and other components
    ...
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig },
    { provide: LY_THEME_CONFIG, useClass: MyCustomTheme }
  ]
  ...
})
export class AppModule { }`;
  }

  ngOnInit() {
  }

  toJson(val: any) {
    // /** Custom theme */
    // const configAlyleUI = ${this.toJson(this.palette)};
    val = JSON.stringify(val, undefined, 2);
    val = (<string>val).replace(/\s\s\"/g, '  ');
    return (<string>val).replace(/\"\:\s/g, ': ');
  }

}

