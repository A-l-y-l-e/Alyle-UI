import { Component } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = ({
  grow: {
    flexGrow: 1
  }
});

@Component({
  selector: 'aui-toolbar-with-icons',
  templateUrl: './toolbar-with-icons.component.html'
})
export class ToolbarWithIconsComponent {
  classes = this._theme.addStyleSheet(styles);
  constructor(private _theme: LyTheme2) { }

}
