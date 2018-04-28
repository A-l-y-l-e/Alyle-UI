import {
  Component,
  Directive,
  Input,
  OnInit,
  OnDestroy,
  HostBinding,
  Optional
}                       from '@angular/core';
import { Subscription } from 'rxjs';
import { LyTheme, LyBgAndColor }      from '@alyle/ui';
import { CommonModule } from '@angular/common';

@Directive({
  selector: 'ly-toolbar-item',
})
export class ToolbarItem {}

@Component({
  selector: 'ly-toolbar',
  template: '<ng-content></ng-content>',
  styleUrls: ['./toolbar.scss', './toolbar-item.scss'],
})
export class LyToolbar implements OnInit, OnDestroy {
  /** Set default bg */
  private _bg = 'primary';

  /** set default color */
  private _color = 'main';

  private _subscription: Subscription;
  @HostBinding('style.background') styleBackground: string;
  @HostBinding('style.color') styleColor: string;

  constructor(
    public theme: LyTheme,
    @Optional() bgAndColor: LyBgAndColor
  ) {
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
  }

  @Input()
  set toolbarBg(val: string) {
    // this._bg = val;
  }

  @Input()
  set toolbarColor(val: string) {
    // this._color = val;
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}

