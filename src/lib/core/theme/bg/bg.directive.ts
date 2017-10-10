import {
  Directive,
  HostBinding,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LyTheme } from '../../palette';

@Directive({
  selector: '[bg]'
})
export class LyBg implements OnInit, OnDestroy {

  private _bg: string = 'primary';
  private _subscription: Subscription;
  private _shade = '500';
  constructor(private theme: LyTheme, private cd: ChangeDetectorRef) { }

  @HostBinding('style.background') private _styleBackground: string;

  ngOnInit() {
    this._subscription = this.theme.palette.subscribe((colors: any) => {
      this.cd.markForCheck();
      this._styleBackground = this.theme.color(this._bg, colors, this._shade);
    });
  }



  @Input('bg')
  set bg(color: string) {
    if (!color) return;
    let _color: any = color.split(/:/);
    this._bg = _color[0];
    this._styleBackground = this.theme.color(this._bg, false, _color[1]);
    if (_color[1]) {
      this._shade = _color[1];
    }
  };

  ngOnDestroy() {
    this._subscription.unsubscribe;
  }

}
