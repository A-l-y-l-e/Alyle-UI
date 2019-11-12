import { Injectable, ElementRef, Optional } from '@angular/core';
import { LyTheme2, ThemeRef } from '../theme/theme2.service';
import { StyleTemplate, Keyframes } from '../parse';
import { LyHostClass } from './host-class';
import { TypeStyle } from '../theme/style';

@Injectable()
export class StyleRenderer {
  constructor(
    _el: ElementRef,
    private _theme: LyTheme2,
    @Optional() private _hostClass: LyHostClass
  ) { }

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
    oldClass: string
  ): string;
  add(
    id: string,
    style: (theme: any, ref: ThemeRef) => StyleTemplate,
    priority: number
  ): string;
  add(
    id: string,
    style: (theme: any, ref: ThemeRef) => StyleTemplate,
    oldClass: string
  ): string;

  add(
    id: string,
    style: (theme: any, ref: ThemeRef) => StyleTemplate,
    priority: number,
    oldClass: string
  ): string;

  add(
    id: string | ((theme: any, ref: ThemeRef) => StyleTemplate),
    style?: ((theme: any, ref: ThemeRef) => StyleTemplate) | number | string,
    priority?: number | string | undefined,
    oldClass?: string | undefined
  ): string {
    const args = arguments;
    /** Class name or keyframe name */
    let className: string | undefined;
    let len = args.length;
    if (args[len - 1] == null) {
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
          className = this._theme._createStyleContent2(style as (theme: any, ref: ThemeRef) => StyleTemplate,
          id,
          priority,
          TypeStyle.LylStyle);
        } else {
          className = this._theme._createStyleContent2(style as (theme: any, ref: ThemeRef) => StyleTemplate,
          id,
          null,
          TypeStyle.LylStyle);
          oldClass = priority;
        }
      } else {
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
      this._hostClass.update(className!, oldClass);
    } else {
      throw new Error(
        `An old class exists, therefore LyHostClass is required `
        + `to replace this class with a new one.\n\n`
        + `Add LyHostClass to the Component or Directive:\n\n`
        + `e.g:\n\n`
        + `@Component({\n`
        + `  providers: [ LyHostClass ]\n`
        + `})\n`
      );
    }
    return className!;
  }

  addKeyframes(keyframes: ((theme: any) => Keyframes)): Keyframes {
    const id = this._theme._createStyleContent2(keyframes,
      null,
      null,
      TypeStyle.Keyframes);
    return id;
  }
}

