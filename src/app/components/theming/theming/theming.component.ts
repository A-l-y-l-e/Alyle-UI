import { Component, OnInit } from '@angular/core';
import { LyPalette } from 'alyle-ui/core';

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
const MyCustomTheme = {
  primary: 'blue', // from palette.blue
  accent: 'pink', // from palette.pink
  other: 'red', // from palette.red
  colorScheme: 'light', // beta, use light or dark
  /**
   * ···set global variables···
   * demo:
   * my-component.component.html
   * <span color="myColor">I am color pink</span>
   */
  schemes: {
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
  /** Palette */
  palette: {
    'blue': {
      default: '#2196F3'
    },
    'pink': {
      default: '#ff4b73'
    },
    'red': {
      default: '#FF5252'
    }
  }
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
