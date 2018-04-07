import {
  Directive,
  OnInit,
  OnChanges,
  Input,
  OnDestroy,
  SimpleChanges,
  Renderer2,
  ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LyTheme } from '../../theme.service';

@Directive({
  selector: '[bg]'
})
export class LyBg implements OnInit, OnChanges, OnDestroy {

  private _bg = 'primary';
  private _subscription: Subscription;
  constructor(
    private theme: LyTheme,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['bg'].firstChange) {
      this.setStyle(this._bg);
    }
  }

  ngOnInit() {
    this._subscription = this.theme.palette.subscribe((colors: any) => {
      this.setStyle(this._bg);
    });
  }

  @Input('bg')
  set bg(color: string) {
    this._bg = color;
  }

  private setStyle(backgroundColor: string) {
    this.renderer.setStyle(this.el.nativeElement, 'background', this.theme.colorOf(backgroundColor));
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}
