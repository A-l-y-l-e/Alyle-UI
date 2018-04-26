import { Injectable, Inject, Renderer2, ElementRef } from '@angular/core';
import { LyTheme, LyRootService, PALETTE, AlyleUIModule, ProvidedInTheme } from '@alyle/ui';
import { DOCUMENT } from '@angular/common';

@Injectable(ProvidedInTheme)
export class LyButtonService {

  constructor(
    @Inject(PALETTE) private palette,
    private theme: LyTheme,
    @Inject(DOCUMENT) document
  ) { }

  applyTheme(renderer: Renderer2, elementRef: ElementRef) {
    const style = this.theme.createStyle('button', this.style.bind(this));
    renderer.addClass(elementRef.nativeElement, style.id);
  }

  private style() {
    return `font-family:${this.palette.typography.fontFamily};` +
    `font-size: ${this.palette.typography.fontSize}px;` +
    `color: ${this.palette.text.default};` +
    /** TODO: add this for Root */
    '-webkit-tap-highlight-color: transparent;' +
    'padding: 0;' +
    'background-color: rgba(0, 0, 0, 0);' +
    'border: none;' +
    '-moz-appearance: none;' +
    'min-height: 36px;' +
    'height: 36px;' +
    'margin: 0;' +
    'border-radius: 3px;' +
    'outline: none;' +
    'font-weight: 500;' +
    'min-width: 88px;' +
    'box-sizing: border-box;' +
    'position: relative;' +
    'text-align: center;' +
    'cursor: pointer;' +
    '-webkit-user-select: none;' +
    '-moz-user-select: none;' +
    '-ms-user-select: none;' +
    'user-select: none;' +
    'display: inline-block;' +
    'transition: all 375ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;';
  }

}
