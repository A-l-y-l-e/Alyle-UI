import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const STYLES = (_theme: ThemeVariables) => ({ });

@Component({
  selector: 'aui-basic-dialog',
  templateUrl: './basic-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicDialogComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);


  constructor(private theme: LyTheme2) { }

  ngOnInit() {
  }

}
