import {
  Directive,
  HostBinding,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LyTheme } from '../../palette';

@Directive({
  selector: '[color]'
})
export class LyColor implements OnChanges, OnInit, OnDestroy {

  private _color = 'primary';
  private _subscription: Subscription;

  constructor(private theme: LyTheme) { }
  @HostBinding('style.color') _styleColor: string;

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['color'].firstChange) {
      this._styleColor = this.theme.colorOf(this._color);
    }
  }

  ngOnInit() {
    this._subscription = this.theme.palette.subscribe((colors: any) => {
      this._styleColor = this.theme.colorOf(this._color);
    });
  }

  @Input('color')
  set color(color: string) {
    this._color = color;
  }
  get color(): string {
    return this._color;
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}
