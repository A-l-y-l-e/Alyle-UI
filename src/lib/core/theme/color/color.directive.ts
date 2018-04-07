import {
  Directive,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Renderer2,
  ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LyTheme } from '../../theme.service';

@Directive({
  selector: '[color]'
})
export class LyColor implements OnChanges, OnInit, OnDestroy {

  private _color = 'primary';
  private _subscription: Subscription;

  constructor(
    private theme: LyTheme,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['color'].firstChange) {
      this.setStyle(this._color);
    }
  }

  ngOnInit() {
    this._subscription = this.theme.palette.subscribe((colors: any) => {
      this.setStyle(this._color);
    });
  }

  @Input('color')
  set color(color: string) {
    this._color = color;
  }
  get color(): string {
    return this._color;
  }

  private setStyle(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'color', this.theme.colorOf(color));
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}

