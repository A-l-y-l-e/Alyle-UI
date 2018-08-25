import {
  Component,
  Directive,
  Optional,
  ChangeDetectionStrategy
} from '@angular/core';
import { LyCommon } from '@alyle/ui';

@Directive({
  selector: 'ly-toolbar-item',
})
export class ToolbarItem {}

@Component({
  selector: 'ly-toolbar',
  template: '<ng-content></ng-content>',
  styleUrls: ['./toolbar.scss', './toolbar-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LyToolbar {

  constructor(
    @Optional() bgAndColor: LyCommon
  ) {
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
  }
}
