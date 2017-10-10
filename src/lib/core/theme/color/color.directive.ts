import {
  Directive,
  HostBinding,
  Input,
  OnInit,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LyTheme } from '../../palette';

@Directive({
  selector: '[color]'
})
export class LyColor implements OnInit, OnDestroy {

  private _color = 'primary';
  private _subscription: Subscription;

  constructor(private theme: LyTheme, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._subscription = this.theme.palette.subscribe((colors: any) => {
      this.cd.markForCheck();
      this._styleColor = this.theme.color(this._color, colors);
    });
  }

  @HostBinding('style.color') _styleColor: string;
  @Input('color')
  set color(color: string) {
    if (!color) return;
    this._color = color;
    this._styleColor = this.theme.color(color);
  };
  get color(): string {
    return this._color;
  }

  ngOnDestroy() {
    this._subscription.unsubscribe;
  }

}
