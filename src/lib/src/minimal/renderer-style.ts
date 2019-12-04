import { Injectable, ElementRef, Optional } from '@angular/core';
import { LyTheme2, ThemeRef } from '../theme/theme2.service';
import { StyleTemplate } from '../parse';
import { LyHostClass } from './host-class';
import { TypeStyle, LyStyles, LyClasses } from '../theme/style';

@Injectable()
export class StyleRenderer {
  constructor(
    _el: ElementRef,
    private _theme: LyTheme2,
    @Optional() private _hostClass: LyHostClass
  ) { }

  /**
   * Build multiple styles and render them in the DOM
   */
  addSheet<T>(styles: T & LyStyles): LyClasses<T> {
    return this._theme._createStyleContent2(styles, null, null, TypeStyle.Multiple);
  }

  add(
    style: (theme: any, ref: ThemeRef) => StyleTemplate
  ): string;
  add(
    style: (theme: any, ref: ThemeRef) => StyleTemplate,
    priority: number
  ): string;
  add(
    style: (theme: any, ref: ThemeRef) => StyleTemplate,
    oldClass: string
  ): string;
  add(
    id: string,
    style: (theme: any, ref: ThemeRef) => StyleTemplate
  ): string;

  add(
    style: (theme: any, ref: ThemeRef) => StyleTemplate,
    priority: number,
    oldClass: string | null
  ): string;
  add(
    id: string,
    style: (theme: any, ref: ThemeRef) => StyleTemplate,
    priority: number
  ): string;
  add(
    id: string,
    style: (theme: any, ref: ThemeRef) => StyleTemplate,
    oldClass: string | null
  ): string;

  add(
    id: string,
    style: (theme: any, ref: ThemeRef) => StyleTemplate,
    priority: number,
    oldClass: string | null
  ): string;

  add(
    id: string | ((theme: any, ref: ThemeRef) => StyleTemplate),
    style?: ((theme: any, ref: ThemeRef) => StyleTemplate) | number | string,
    priority?: number | string | undefined | null,
    oldClass?: string | undefined | null
  ): string {
    const args = arguments;
    /** Class name or keyframe name */
    let className: string | undefined;
    let len = args.length;

    // clean
    if (len === 4 && args[3] == null) {
      len -= 1;
    }
    if (len === 3 && args[2] == null) {
      len -= 1;
    }

    if (len === 1) {
      className = this._theme._createStyleContent2(id,
        null,
        null,
        TypeStyle.LylStyle);
    } else if (len === 2) {
      if (typeof id === 'string') {
        className = this._theme._createStyleContent2(style as (theme: any, ref: ThemeRef) => StyleTemplate,
          id,
          null,
          TypeStyle.LylStyle);
      } else if (typeof style === 'number') {
        className = this._theme._createStyleContent2(id as (theme: any, ref: ThemeRef) => StyleTemplate,
          null,
          style,
          TypeStyle.LylStyle);
      } else {
        className = this._theme._createStyleContent2(id as (theme: any, ref: ThemeRef) => StyleTemplate,
          null,
          null,
          TypeStyle.LylStyle);
          oldClass = style as string;
      }
    } else if (len === 3) {
      if (typeof id === 'string') {
        if (typeof priority === 'number') {
          // (id, style, priority)
          className = this._theme._createStyleContent2(style as (theme: any, ref: ThemeRef) => StyleTemplate,
          id,
          priority,
          TypeStyle.LylStyle);
        } else {
          // (id, style, oldClass)
          className = this._theme._createStyleContent2(style as (theme: any, ref: ThemeRef) => StyleTemplate,
          id,
          null,
          TypeStyle.LylStyle);
          oldClass = priority;
        }
      } else {
        // (style, priority, oldClass)
        className = this._theme._createStyleContent2(id as (theme: any, ref: ThemeRef) => StyleTemplate,
          null,
          style as number,
          TypeStyle.LylStyle);
        oldClass = priority as string;
      }
    } else if (len === 4) {
      className = this._theme._createStyleContent2(style as (theme: any, ref: ThemeRef) => StyleTemplate,
        id as string,
        priority as number,
        TypeStyle.LylStyle);
    }
    if (this._hostClass) {
      return this._hostClass.update(className!, oldClass);
    }
    throw new Error(
      `LyHostClass is required `
      + `to update classes.\n\n`
      + `Add LyHostClass to Component or Directive:\n\n`
      + `e.g:\n\n`
      + `@Component({\n`
      + `  providers: [ LyHostClass ]\n`
      + `})\n`
    );
  }
}

