import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = {
  drawerContainer: {
    height: '225px',
    transform: 'translate3d(0,0,0)'
  },
  drawer: {
    height: '100%',
    width: '150px'
  },
  drawerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    display: 'flex'
  }
};

@Component({
  selector: 'drawer-demo-01',
  templateUrl: './drawer-demo-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerDemo01Component {
  classes = this._theme.addStyleSheet(styles, 'drawer-demo-01');
  mode = 'side';

  constructor(private _theme: LyTheme2) { }
}
