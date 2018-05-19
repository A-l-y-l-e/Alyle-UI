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
  Renderer2
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { LyRippleModule, LyRipple } from '@alyle/ui/ripple';
import { Platform, LyBgColorAndRaised } from '@alyle/ui';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LyIconButtonService } from './icon-button.service';

@Component({
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
export class LyIconButton {
  private _iconStyle: {[key: string]: string | number};
  @ViewChild(LyRipple) ripple: LyRipple;

  constructor(
    public elementRef: ElementRef,
    renderer: Renderer2,
    @Optional() private bgAndColor: LyBgColorAndRaised,
    public iconButtonService: LyIconButtonService
  ) {
    renderer.addClass(elementRef.nativeElement, iconButtonService.classes.host);
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
  }
}

