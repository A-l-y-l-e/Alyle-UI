import { Injectable, Inject, Renderer2, ElementRef } from '@angular/core';
import { LyTheme, LyRootService, StyleData } from '@alyle/ui';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LyRippleService {
  stylesData: StyleData[] = [];
  constructor(
    private theme: LyTheme
  ) {
    const host = this.theme.createStyle('ripple', () => {
      return 'position: relative;';
    });
    const rippleContainer = this.theme.createStyle('ripple-cont', () => {
      return `position: absolute;` +
      `width: 5px;` +
      `height: 5px;` +
      `background: currentColor;` +
      `opacity: .19;` +
      `border-radius: 100%;` +
      `-webkit-transform: scale(0);` +
      `transform: scale(0);` +
      `-webkit-transition: opacity ease,-webkit-transform cubic-bezier(0,0,0.2,1);` +
      `transition: opacity ease,-webkit-transform cubic-bezier(0,0,0.2,1);` +
      `transition: opacity ease,transform cubic-bezier(0,0,0.2,1);` +
      `transition: opacity ease,transform cubic-bezier(0,0,0.2,1),-webkit-transform cubic-bezier(0,0,0.2,1);` +
      `pointer-events: none;`;
    });
    this.stylesData.push(host, rippleContainer);
  }

}
