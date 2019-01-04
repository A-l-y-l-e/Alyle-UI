import { Component } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = ({
  root: {
    width: '100%',
    maxWidth: '360px'
  }
});

@Component({
  selector: 'aui-folder-list',
  templateUrl: './folder-list.component.html'
})
export class FolderListComponent {
  readonly classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2
  ) { }
}
