import { Component, OnInit } from '@angular/core';
import { LyPalette } from '@alyle/ui';

@Component({
  selector: 'app-theming',
  templateUrl: './theming.component.html',
  styleUrls: ['./theming.component.css']
})
export class ThemingComponent implements OnInit {
  code: string;
  constructor() {
    this.code = code;
  }

  /**
   * TODO: get all color from lyTheme
   */
  colors() {

  }

  ngOnInit() {
  }

}

const code = `
/** My new theme */
const contrast = '#fff';
const MyCustomTheme = {
  primary: {
    default: '#2196F3',
    contrast
  },
  accent: {
    default: '#ff4b73',
    contrast
  },
  warn: {
    default: '#FF5252',
    contrast
  },
  scheme: 'light', // select of schemes
  colorSchemes: {
    light: {
      shadow: 'rgba(0, 0, 0, 0.1111)',
      myColor: 'pink',
      /**
       * mode ligth
       * <div bg="others:footer">footer content</div>
       */
      others: {
        footer: '#ccc'
      }
    },
    dark: {
      primary: {
        default: '#00bcd4',
        contrast
      },
      shadow: '#252525',
      myColor: 'teal',
      /**
       * mode dark
       * <div bg="others:footer">footer content</div>
       */
      others: {
        footer: '#999'
      }
    }
  },
  /**
   * ···set global variables···
   * demo:
   * <span color="myColor2">I am color pink</span>
   */
  myColor2: 'pink'
};
/** set theme */
@NgModule({
  ...
  imports: [
    ...
    AlyleUIModule.forRoot(MyCustomTheme),
    ...
  ],
  ...
})
export class AppModule {}

`;
