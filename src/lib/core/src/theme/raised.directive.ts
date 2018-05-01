import { Directive, Input, OnChanges, SimpleChanges, ElementRef, Renderer2, Optional, Inject } from '@angular/core';
import { LyShadowService } from './shadow.service';
import { StyleData } from '../theme.service';
import { PALETTE, ThemeVariables } from '../alyle-config-service';

// @Directive({ selector: ':not([color])[bg][raised], [color][bg][raised]' })
// export class LyRaisedBg {
//   elevation = '3';
//   private currentStyleData: StyleData;
//   /** Raised with color of [bg] */
//   @Input()
//   set raised(nothing: any) {
//     this.shadow.setShadow(this.elementRef, this.renderer, [ this.elevation, this.bgAndColor.cssBg || this.palette.colorShadow ], this.currentStyleData);
//   }

//   constructor(
//     private elementRef: ElementRef,
//     private renderer: Renderer2,
//     @Inject(PALETTE) private palette: ThemeVariables,
//     @Optional() private bgAndColor: LyBgAndColor,
//     private shadow: LyShadowService
//   ) { }
// }

// @Directive({ selector: ':not([bg])[color][raised]' })
// export class LyRaisedColor {
//   elevation = '3';
//   private currentStyleData: StyleData;
//   /** Raised with color of [color] */
//   @Input()
//   set raised(nothing: any) {
//     this.shadow.setShadow(this.elementRef, this.renderer, [ this.elevation, this.bgAndColor.cssColor || this.palette.colorShadow ], this.currentStyleData);
//   }
//   constructor(
//     private elementRef: ElementRef,
//     private renderer: Renderer2,
//     @Inject(PALETTE) private palette: ThemeVariables,
//     @Optional() private bgAndColor: LyBgAndColor,
//     private shadow: LyShadowService
//   ) { }
// }


// @Directive({ selector: ':not([bg]):not([color])[raised]' })
// export class LyRaised {
//   elevation = '3';
//   private currentStyleData: StyleData;
//   /** Default raised  */
//   @Input()
//   set raised(nothing: any) {
//     this.shadow.setShadow(this.elementRef, this.renderer, [ this.elevation, this.palette.colorShadow ], this.currentStyleData);
//   }

//   constructor(
//     private elementRef: ElementRef,
//     private renderer: Renderer2,
//     @Inject(PALETTE) private palette: ThemeVariables,
//     private shadow: LyShadowService
//   ) { }

// }

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
    @Inject(PALETTE) private palette: ThemeVariables,
    private shadow: LyShadowService
  ) { }
}
