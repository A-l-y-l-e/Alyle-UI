import { Injectable, Inject, Renderer2, ElementRef } from '@angular/core';
import { LyTheme, LyRootService, ProvidedInTheme } from '@alyle/ui';
import { DOCUMENT } from '@angular/common';

@Injectable(ProvidedInTheme)
export class LyRippleService {
  stylesData: string[] = [];
  classes = {
    root: this.theme.setRootStyle(
      'ripple',
      () => (
        `z-index: 0;` +
        `border-radius: inherit;`
      )
    )
  };
  constructor(
    private theme: LyTheme
  ) {
    const host = this.theme.setRootStyle('ripple', () => {
      return 'position: relative;';
    });
    const rippleContainer = this.theme.setRootStyle('ripple-cont', () => {
      return `position: absolute;` +
      `width: 5px;` +
      `height: 5px;` +
      `background: currentColor;` +
      `opacity: .19;` +
      `border-radius: 100%;` +
      `-webkit-transform: scale(0);` +
      `transform: scale(0);` +
      `-webkit-transition: opacity ease,-webkit-transform cubic-bezier(.1, 1, 0.5, 1);` +
      `transition: opacity ease,-webkit-transform cubic-bezier(.1, 1, 0.5, 1);` +
      `transition: opacity ease,transform cubic-bezier(.1, 1, 0.5, 1);` +
      `transition: opacity ease,transform cubic-bezier(.1, 1, 0.5, 1);` +
      `pointer-events: none;`;
    });
    this.stylesData.push(host, rippleContainer);
  }

}
