import { Injectable, Renderer2, ElementRef }       from '@angular/core';
import * as _chroma from 'chroma-js';
import { ProvidedInTheme } from '../alyle-ui.module';
import { LyTheme } from '../theme.service';
import { shadowBuilder } from '../shadow';
const chroma = _chroma;

@Injectable(ProvidedInTheme)
export class LyShadowService {
  /** Default elevation */
  elevation = 1;
  constructor(
    private theme: LyTheme
  ) { }

  /** demo: setShadow(...[elevation, color]...) */
  setShadow(elementRef: ElementRef, renderer: Renderer2, val: [number, string], oldClassName?: string) {
    let keys: string;
    let elevation: number;
    let color = 'colorShadow';
    if (val) {
      keys = val.join('');
      elevation = val[0];
      color = val[1] || color;
    } else {
      keys = `${this.elevation}${color}`;
      elevation = this.elevation;
    }
    const classname = this.theme.setStyle(`shadow${keys}`, () => {
      return `${shadowBuilder(elevation, this.theme.colorOf(color))}`;
    });
    this.theme.updateClassName(elementRef.nativeElement, renderer, classname, oldClassName);
    return classname;
  }
}

