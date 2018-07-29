import { Directive, Renderer2, ElementRef, Input, OnInit } from '@angular/core';
import { LyTheme2, shadowBuilder } from '@alyle/ui';

@Directive({
  selector: 'ly-card'
})
export class LyCard implements OnInit {
  @Input() elevation: any;

  constructor(
    private styler: LyTheme2,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    const newClass = this.styler.setUpStyleSecondary<any>(
      'k-card',
      theme => (
        `background-color:${theme.background.primary};` +
        `display:block;` +
        `position:relative;` +
        `padding:24px;` +
        `border-radius:2px;` +
        `${shadowBuilder(this.elevation)}`
      )
    );
    this.renderer.addClass(this.elementRef.nativeElement, newClass);
  }

}
