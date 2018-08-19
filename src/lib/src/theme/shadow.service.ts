import { Injectable, Renderer2, ElementRef } from '@angular/core';
import { shadowBuilderDeprecated } from '../shadow';
import { LyTheme2 } from './theme2.service';

@Injectable({
  providedIn: 'root'
})
export class LyShadowService {
  /** Default elevation */
  elevation = 1;
  /** demo: setShadow(...[elevation, color]...) */
  setShadow(theme: LyTheme2, elementRef: ElementRef, renderer: Renderer2, val: [number, string], oldClassName?: string) {
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
    const classname = theme.setUpStyle(`shadow${keys}`, {'': () => {
      return `${shadowBuilderDeprecated(elevation, theme.colorOf(color))}`;
    }});
    theme.updateClassName(elementRef.nativeElement, renderer, classname, oldClassName);
    return classname;
  }
}

