import {
  LyTheme2, CoreTheme
} from '@alyle/ui';
import {
  Injectable,
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LyButtonService {
  classes = {
    root: this.coreTheme.setUpStyleSecondary(
      'button', {
        '': rootStyle
      }),
    outlined: this.coreTheme.setUpStyle(
      'btntlnd',
      {'': () => (
        `border: 1px solid currentColor`
      )}
    ),
    buttonContent: this.coreTheme.setUpStyle(
      'buttonContent',
      {'': () => (
        `padding:0;` +
        `display:flex;` +
        `justify-content:inherit;` +
        `align-items:inherit;` +
        `align-content:inherit;` +
        `width: 100%;` +
        `height: 100%;` +
        `box-sizing: border-box;`
      )}
    ),
    currentConfig: this.theme.setUpStyleSecondary<any>(
      'buttonConfig',
      theme => {
        const { button, fontFamily } = theme.typography;
        console.log({button});
        let styleButton = (
          `font-family:${button.fontFamily || fontFamily};` +
          `font-weight:${button.fontWeight};` +
          `font-size:${theme.pxToRem(button.fontSize)};` +
          `color:${theme.text.default};`
        );
        if (theme.letterSpacing) {
          styleButton += `letter-spacing:${theme.pxToRem(button.letterSpacing)};`;
        }
        if (button.textTransform) {
          styleButton += `text-transform:${button.textTransform};`;
        }
        return styleButton;
      }
    )
  };
  constructor(
    private coreTheme: CoreTheme,
    private theme: LyTheme2
  ) { }
}

function rootStyle() {
  return '-webkit-tap-highlight-color:transparent;' +
  'background-color:rgba(0, 0, 0, 0);' +
  'border:0;' +
  'padding:0 16px;' +
  '-moz-appearance:none;' +
  'min-height:36px;' +
  'height:36px;' +
  'margin:0;' +
  'border-radius:3px;' +
  'outline:none;' +
  'font-weight:500;' +
  'min-width:88px;' +
  'box-sizing:border-box;' +
  'position:relative;' +
  `justify-content:center;` +
  `align-items:center;` +
  `align-content:center;` +
  'display:inline-flex;' +
  'cursor:pointer;' +
  '-webkit-user-select:none;' +
  '-moz-user-select:none;' +
  '-ms-user-select:none;' +
  'user-select:none;' +
  'text-decoration-line:none;' +
  '-webkit-text-decoration-line:none;' +
  'transition:all 375ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;' +
  `overflow: hidden;`;
}
