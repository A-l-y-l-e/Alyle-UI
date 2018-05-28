import { Directive, Input, OnChanges, SimpleChanges, ElementRef, Renderer2, Optional, Inject } from '@angular/core';
import { LyShadowService } from './shadow.service';
import { ThemeVariables } from '../alyle-config-service';
import { LyTheme2 } from './theme2.service';

@Directive({ selector: ':not([raised])[newRaised]' })
export class LyNewRaised {
  elevation = 3;
  private currentClassName: string;
  /** Default raised  */
  @Input()
  set newRaised(value: [number, string]) {
    this.currentClassName = this.shadow.setShadow(this.theme, this.elementRef, this.renderer, [ value[0] || this.elevation, value[1] || 'colorShadow' ], this.currentClassName);
  }

  constructor(
    private theme: LyTheme2,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private shadow: LyShadowService
  ) { }
}
