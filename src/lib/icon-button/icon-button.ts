import {
  NgModule,
  Component,
  ElementRef,
  Input,
  Directive,
  ModuleWithProviders,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostBinding,
  HostListener,
  isDevMode,
  Optional,
  Renderer2,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { LyRippleModule, LyRipple } from '@alyle/ui/ripple';
import { Platform, LyCommon, LyTheme2 } from '@alyle/ui';
import { LyIconButtonService } from './icon-button.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[ly-icon-button], a[ly-icon-button], span[ly-icon-button]',
  template: `
  <div class="{{ iconButtonService.classes.content }}"
  lyRipple
  lyRippleCentered
  >
    <ng-content></ng-content>
  </div>
  `,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lyIconButton'
})
export class LyIconButton implements OnInit {
  private _iconStyle: {[key: string]: string | number};
  @ViewChild(LyRipple) ripple: LyRipple;
  get classes() {
    return {
      config: this.theme.setUpStyle('iconButtonConfig', {
        '': () => (
          `width:${this.theme.config.iconButton.size};` +
          `height:${this.theme.config.iconButton.size};`
        )
      })
    };
  }
  constructor(
    public elementRef: ElementRef,
    private renderer: Renderer2,
    @Optional() private bgAndColor: LyCommon,
    public iconButtonService: LyIconButtonService,
    private theme: LyTheme2
  ) {
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
  }

  ngOnInit() {
    this.renderer.addClass(this.elementRef.nativeElement, this.iconButtonService.classes.host);
    this.renderer.addClass(this.elementRef.nativeElement, this.classes.config);
  }
}

