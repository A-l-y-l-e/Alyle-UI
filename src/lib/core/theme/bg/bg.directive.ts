import {
  Directive,
  HostBinding,
  OnInit,
  OnChanges,
  Input,
  ChangeDetectorRef,
  OnDestroy,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LyTheme } from '../../palette';

@Directive({
  selector: '[bg]'
})
export class LyBg implements OnInit, OnChanges, OnDestroy {

  private _bg = 'primary';
  private _subscription: Subscription;
  constructor(private theme: LyTheme, private cd: ChangeDetectorRef) { }

  @HostBinding('style.background') private _styleBackground: string;

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['bg'].firstChange) {
      this._styleBackground = this.theme.colorOf(this._bg);
    }
  }

  ngOnInit() {
    this._subscription = this.theme.palette.subscribe((colors: any) => {
      this._styleBackground = this.theme.colorOf(this._bg);
    });
  }

  @Input('bg')
  set bg(color: string) {
    this._bg = color;
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}
