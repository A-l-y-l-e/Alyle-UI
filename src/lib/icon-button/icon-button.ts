import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Optional,
  Renderer2,
  ChangeDetectionStrategy,
  AfterViewInit,
  NgZone,
  OnDestroy
} from '@angular/core';

import { LyRippleService, Ripple } from '@alyle/ui/ripple';
import { LyCommon, LyTheme2, Platform } from '@alyle/ui';
import { LyIconButtonService } from './icon-button.service';

const STYLE_PRIORITY = -2;

const styles = theme => ({
  size: {
    width: theme.iconButton.size,
    height: theme.iconButton.size
  }
});

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[ly-icon-button], a[ly-icon-button], span[ly-icon-button]',
  template: `
  <div [className]="iconButtonService.classes.content"
  ><ng-content></ng-content></div>
  <div #rippleContainer [className]="_rippleService.classes.container"></div>
  `,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lyIconButton'
})
export class LyIconButton implements OnInit, AfterViewInit, OnDestroy {
  classes = this.theme.addStyleSheet(styles, 'lyIconButton', STYLE_PRIORITY);
  private _ripple: Ripple;
  @ViewChild('rippleContainer') _rippleContainer: ElementRef;
  constructor(
    public _el: ElementRef,
    private renderer: Renderer2,
    @Optional() bgAndColor: LyCommon,
    public iconButtonService: LyIconButtonService,
    private theme: LyTheme2,
    private _ngZone: NgZone,
    public _rippleService: LyRippleService,
  ) {
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
  }

  ngOnInit() {
    this.renderer.addClass(this._el.nativeElement, this.iconButtonService.classes.root);
    this.renderer.addClass(this._el.nativeElement, this.classes.size);
  }

  ngAfterViewInit() {
    if (Platform.isBrowser) {
      const rippleContainer = this._rippleContainer.nativeElement;
      const triggerElement = this._el.nativeElement;
      this._ripple = new Ripple(this._ngZone, this._rippleService.classes, rippleContainer, triggerElement);
      this._ripple.setConfig({
        centered: true
      });
    }
  }

  ngOnDestroy() {
    if (Platform.isBrowser) {
      this._ripple.removeEvents();
    }
  }
}

