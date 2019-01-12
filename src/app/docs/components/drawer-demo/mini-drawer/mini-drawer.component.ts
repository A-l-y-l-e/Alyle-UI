import { Component } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLES = ({
  drawerContainer: {
    height: '270px',
    transform: 'translate3d(0,0,0)'
  },
  drawerContent: {
    padding: '1em'
  },
  icon: {
    margin: '0 8px'
  }
});
const DEFAULT = '170px over@XSmall';
const MINI = '56px over@XSmall';

@Component({
  selector: 'aui-mini-drawer',
  templateUrl: './mini-drawer.component.html'
})
export class MiniDrawerComponent {
  readonly classes = this._theme.addStyleSheet(STYLES);
  mini = false;

  get width() {
    return this.mini ? MINI : DEFAULT;
  }

  constructor(private _theme: LyTheme2) { }

  toggleMini() {
    this.mini = !this.mini;
  }
}
