import {
  AlyleUIModule,
  LyRootService,
  LyTheme,
  PALETTE,
  ProvidedInTheme
} from '@alyle/ui';
import { DOCUMENT } from '@angular/common';
import {
  ElementRef,
  Inject,
  Injectable,
  Renderer2
} from '@angular/core';

@Injectable(ProvidedInTheme)
export class LyButtonService {
  private rootClassName: string;
  private themeClassName: string;
  constructor(
    @Inject(PALETTE) private palette,
    private theme: LyTheme
  ) {
    this.rootClassName = this.theme.createStyle('rbtn', this.rootStyle.bind(this), undefined, true).id;
    this.themeClassName = this.theme.createStyle('btn', this.style.bind(this)).id;
  }

  applyTheme(renderer: Renderer2, elementRef: ElementRef) {
    renderer.addClass(elementRef.nativeElement, this.rootClassName);
    renderer.addClass(elementRef.nativeElement, this.themeClassName);
  }

  private style() {
    return `font-family:${this.palette.typography.fontFamily};` +
    `font-size: ${this.palette.typography.fontSize}px;` +
    `color: ${this.palette.text.default};`;
  }
  private rootStyle() {
    return '-webkit-tap-highlight-color: transparent;' +
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
