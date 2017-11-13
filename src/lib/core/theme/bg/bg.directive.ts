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

  private _bg = 'primary';
  private _subscription: Subscription;
  private _shade = '500';
  constructor(private theme: LyTheme, private cd: ChangeDetectorRef) { }

  @HostBinding('style.background') private _styleBackground: string;

  ngOnInit() {
    this._subscription = this.theme.palette.subscribe((colors: any) => {
      this.cd.markForCheck();
      this._styleBackground = this.theme.colorOf(this._bg);
    });
  }

  @Input('bg')
  set bg(color: string) {
    if (!color) { return; }
    this._bg = color;
    const shade = this.theme.AlyleUI.currentTheme.shade;
    this._styleBackground = this.theme.colorOf(this._bg);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}
