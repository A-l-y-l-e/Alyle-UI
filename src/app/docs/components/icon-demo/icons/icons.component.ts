import { Component } from '@angular/core';
import { LyIconService } from '@alyle/ui/icon';
import { LyTheme2 } from '@alyle/ui';
import { DomSanitizer } from '@angular/platform-browser';

const styles = ({
  icon: {
    marginEnd: '.5em'
  },
  iconLarge: {
    fontSize: '48px'
  },
  iconExtraLarge: {
    fontSize: '72px'
  }
});

@Component({
  selector: 'aui-icons',
  templateUrl: './icons.component.html'
})
export class IconsComponent {
  readonly classes = this._theme.addStyleSheet(styles);
  constructor(
    private _theme: LyTheme2,
    icon: LyIconService,
    sanitizer: DomSanitizer,
  ) {
    // Url SVG icon: ./assets/svg/rocket.svg
    // Do not require extension name
    icon.setSvg('rocket', sanitizer.bypassSecurityTrustResourceUrl('./assets/svg/rocket'));

    icon.addSvgIconLiteral('lab', sanitizer.bypassSecurityTrustHtml(labSvgIcon));
  }

}

// tslint:disable
const labSvgIcon = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve">
  <g id="lab_1_">
    <path fill="#333333" d="M20.682,3.732C20.209,3.26,19.582,3,18.914,3s-1.295,0.26-1.77,0.733l-1.41,1.412 C15.261,5.617,15,6.245,15,6.914c0,0.471,0.129,0.922,0.371,1.313L1.794,13.666c-0.908,0.399-1.559,1.218-1.742,2.189 c-0.185,0.977,0.125,1.979,0.834,2.687l12.72,12.58c0.548,0.548,1.276,0.859,2.045,0.877C15.669,32,15.711,32,15.729,32 c0.202,0,0.407-0.021,0.61-0.062c0.994-0.206,1.808-0.893,2.177-1.828l5.342-13.376c0.402,0.265,0.875,0.407,1.367,0.407 c0.67,0,1.297-0.261,1.768-0.733L28.4,15c0.477-0.474,0.738-1.103,0.738-1.773s-0.262-1.3-0.732-1.768L20.682,3.732z  M16.659,29.367c-0.124,0.313-0.397,0.544-0.727,0.612c-0.076,0.016-0.153,0.022-0.229,0.021c-0.254-0.006-0.499-0.108-0.682-0.292 L2.293,17.12c-0.234-0.233-0.337-0.567-0.275-0.893c0.061-0.324,0.279-0.598,0.582-0.73l6.217-2.49 c4.189,1.393,8.379,0.051,12.57,4.522L16.659,29.367z M26.992,13.58l-1.414,1.413c-0.195,0.196-0.512,0.196-0.707,0l-1.768-1.767 l-1.432,3.589l0.119-0.303c-3.01-3.005-6.069-3.384-8.829-3.723c-0.887-0.109-1.747-0.223-2.592-0.405l8.491-3.401l-1.715-1.715 c-0.195-0.195-0.195-0.512,0-0.707l1.414-1.415c0.195-0.195,0.512-0.195,0.707,0l7.725,7.727 C27.189,13.068,27.189,13.385,26.992,13.58z" />
    <path fill="#333333" d="M16.5,21c1.378,0,2.5-1.121,2.5-2.5S17.879,16,16.5,16c-1.379,0-2.5,1.121-2.5,2.5S15.122,21,16.5,21z  M16.5,17c0.828,0,1.5,0.672,1.5,1.5S17.328,20,16.5,20c-0.829,0-1.5-0.672-1.5-1.5S15.671,17,16.5,17z" />
    <path fill="#333333" d="M29.5,0C28.121,0,27,1.121,27,2.5S28.121,5,29.5,5S32,3.879,32,2.5S30.879,0,29.5,0z M29.5,4 C28.672,4,28,3.328,28,2.5S28.672,1,29.5,1S31,1.672,31,2.5S30.328,4,29.5,4z" />
    <path fill="#333333" d="M8,17c0,1.103,0.897,2,2,2s2-0.897,2-2s-0.897-2-2-2S8,15.897,8,17z M10,16c0.552,0,1,0.447,1,1 s-0.448,1-1,1s-1-0.447-1-1S9.448,16,10,16z" />
    <circle fill="#333333" cx="13" cy="23" r="1" />
    <circle fill="#333333" cx="29" cy="8" r="1" />
  </g>
</svg>
`;
