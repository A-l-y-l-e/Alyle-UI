import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLES = ({
  card: {
    margin: '1em 0',
    display: 'flex'
  },
  icon: {
    alignItems: 'center',
    display: 'flex',
    '& svg *': {
      fill: 'inherit'
    }
  },
  cardContent: {
    paddingLeft: 0,
    paddingRight: 0,
    alignItems: 'center',
    display: 'flex'
  }
});

@Component({
  selector: 'aui-package-status',
  templateUrl: './package-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PackageStatusComponent implements OnInit {
  classes = this._theme.addStyleSheet(STYLES, 'aui-package-status');
  @Input() status: 'beta' | 'deprecated';
  @Input() packageName: string;

  constructor(
    private _theme: LyTheme2
  ) { }

  ngOnInit() {
  }

}
