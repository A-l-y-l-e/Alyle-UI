import {
  Component,
  Directive,
  Input,
  OnInit,
  OnDestroy,
  HostBinding}          from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LyTheme }      from 'alyle-ui/core';
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

  constructor(public theme: LyTheme) { }

  @Input()
  set toolbarBg(val: string) {
    this._bg = val;
  }

  @Input()
  set toolbarColor(val: string) {
    this._color = val;
  }

  ngOnInit() {
    this._subscription = this.theme.palette.subscribe((colors: any) => {
      this.styleBackground = this.theme.colorOf(this._bg);
      this.styleColor = this.theme.colorOf(this._color);
    });
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}

