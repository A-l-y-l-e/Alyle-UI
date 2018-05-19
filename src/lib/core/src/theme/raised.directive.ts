import { Directive, Input, OnChanges, SimpleChanges, ElementRef, Renderer2, Optional, Inject } from '@angular/core';
import { LyShadowService } from './shadow.service';
import { ThemeVariables } from '../alyle-config-service';

@Directive({ selector: ':not([raised])[newRaised]' })
export class LyNewRaised {
  elevation = 3;
  private currentClassName: string;
  /** Default raised  */
  @Input()
  set newRaised(value: [number, string]) {
    this.currentClassName = this.shadow.setShadow(this.elementRef, this.renderer, [ value[0] || this.elevation, value[1] || 'colorShadow' ], this.currentClassName);
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private shadow: LyShadowService
  ) { }
}
