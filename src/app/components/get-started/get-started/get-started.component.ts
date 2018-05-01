import { Component, OnInit, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import { LyTheme, PALETTE } from '@alyle/ui';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetStartedComponent implements OnInit {
  code: string;
  constructor(
    public theme: LyTheme,
    @Inject(PALETTE) private palette: LyTheme
  ) {
    this.code = `...
/** Important for Animations */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Core module & common module */
import { AlyleUIModule, LyCommonModule } from '@alyle/ui';

@NgModule({
  ...
  imports: [
    ...
    BrowserAnimationsModule,
    AlyleUIModule.forRoot({
      /** You can put any other name */
      name: 'default'
    }),
    LyCommonModule
    ...
  ],
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

