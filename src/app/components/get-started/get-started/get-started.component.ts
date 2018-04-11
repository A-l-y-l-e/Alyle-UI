import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetStartedComponent implements OnInit {
  code = _code;
  constructor() { }

  ngOnInit() {
  }

}

const _code = `
...
/** Important for Animations */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Core module */
import { AlyleUIModule } from 'alyle-ui';

/** Responsive module (Optional) */
import { ResponsiveModule } from 'alyle-ui/responsive';

/** Custom theme */
const configAlyleUI = {
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
    'blue': {
      '500': '#2196F3',
      contrast: 'light'
    },
    'pink': {
      '500': '#ff4b73',
      contrast: 'light'
    },
    'red': {
      '500': '#FF5252',
      contrast: 'light'
    }
  }
};
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
export class AppModule {}
`;
