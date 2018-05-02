import { Directive, Input, OnChanges, SimpleChanges, ElementRef, Renderer2, Optional, Inject } from '@angular/core';
import { LyShadowService } from './shadow.service';
import { StyleData } from '../theme.service';
import { ThemeVariables } from '../alyle-config-service';

@Directive({ selector: ':not([raised])[newRaised]' })
export class LyNewRaised {
  elevation = 3;
  private currentStyleData: StyleData;
  /** Default raised  */
  @Input()
  set newRaised(value: [number, string]) {
    this.currentStyleData = this.shadow.setShadow(this.elementRef, this.renderer, [ value[0] || this.elevation, value[1] || 'colorShadow' ], this.currentStyleData);
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private shadow: LyShadowService
  ) { }
}
