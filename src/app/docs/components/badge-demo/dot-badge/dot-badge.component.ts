import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLES = () => {
  return {

  };
};

@Component({
  selector: 'aui-dot-badge',
  templateUrl: './dot-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DotBadgeComponent implements OnInit {
  readonly classes = this._theme.renderStyleSheet(STYLES);

  constructor(
    private _theme: LyTheme2
  ) { }

  ngOnInit() {
  }

}
