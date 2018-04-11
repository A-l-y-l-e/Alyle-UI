import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme } from 'alyle-ui/core';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetStartedComponent implements OnInit {
  code: string;
  constructor(
    public theme: LyTheme
  ) {
    this.code = `
...
/** Important for Animations */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Core module */
import { AlyleUIModule } from 'alyle-ui';

/** Responsive module (Optional) */
import { ResponsiveModule } from 'alyle-ui/responsive';

/** Custom theme */
const configAlyleUI = ${this.toJson(this.theme.AlyleUI.currentTheme)};
@NgModule({
  ...
  imports: [
    ...
    BrowserAnimationsModule,
    AlyleUIModule.forRoot(configAlyleUI),
    ResponsiveModule
    ...
  ],
  ...
})
export class AppModule { }`;
  }

  ngOnInit() {
  }

  toJson(val: any) {
    val = JSON.stringify(val, undefined, 2);
    val = (<string>val).replace(/\s\s\"/g, ' ');
    return (<string>val).replace(/\"\:\s/g, ': ');
  }

}

