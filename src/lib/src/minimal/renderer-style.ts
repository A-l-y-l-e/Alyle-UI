import { Injectable, ElementRef, Renderer2, Optional } from '@angular/core';
import { LyTheme2, ThemeRef } from '../theme/theme2.service';
import { StyleTemplate } from '../parse';
import { TypeStyle, LyStyles, LyClasses } from '../theme/style';

const __CLASS_NAME__ = '__CLASS_NAME__';

@Injectable()
export class StyleRenderer {
  private readonly _set: Set<string> = new Set<string>();
  private _nEl: HTMLElement;

  constructor(
    private _theme: LyTheme2,
    @Optional() _el: ElementRef,
    @Optional() private _renderer: Renderer2
  ) {
    if (_el) {
      this._nEl = _el.nativeElement;
      this._set = new Set<string>();
    }
  }

  /**
   * Build multiple styles and render them in the DOM.
   * @param styles Styles
   * @param applyRootClass If `applyToRoot` is `true` and the root property is defined,
   * it will automatically be added to the component.
   *
   * e.g.
   *
   * ```ts
   * const STYLES = () => ({
   *   root: lyl `{...}` // this class will be added to the root component
   * })
   * ```
   *
   */
  renderSheet<T>(styles: T & LyStyles, applyRootClass?: boolean): LyClasses<T> {
    const classes = this._theme._createStyleContent2(styles, null, null, TypeStyle.Multiple);
    if (applyRootClass && classes.root) {
      this.addClass(classes.root);
    }
    return classes;
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

  /**
   * Render style and apply class name to host Component or Directive,
   * require provide `StyleRenderer` in your Component.
   * e.g.
   * @Component({
   *   ...
   *   providers: [ StyleRenderer ]
   * })
   */
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
    if (this._nEl) {
      return this.updateClass(className!, oldClass);
    }
    throw new Error(
      `StyleRenderer is required on the Component!\n`
      + `Add provider for StyleRenderer in Component or Directive:\n\n`
      + `e.g:\n\n`
      + `@Component({\n`
      + `  providers: [ StyleRenderer ]\n`
      + `})\n`
    );
  }

  render(
    style: (theme: any, ref: ThemeRef) => StyleTemplate
  ): string;
  render(
    style: (theme: any, ref: ThemeRef) => StyleTemplate,
    priority: number
  ): string;
  render(
    id: string,
    style: (theme: any, ref: ThemeRef) => StyleTemplate
  ): string;
  render(
    id: string,
    style: (theme: any, ref: ThemeRef) => StyleTemplate,
    priority: number
  ): string;

  /**
   * Only render style and return class name.
   */
  render(
    styleOrId: string | ((theme: any, ref: ThemeRef) => StyleTemplate),
    priorityOrStyle?: ((theme: any, ref: ThemeRef) => StyleTemplate) | number | string,
    priority?: number | undefined | null
  ): string {
    if (typeof styleOrId === 'string') {
      return this._theme._createStyleContent2(priorityOrStyle as (theme: any, ref: ThemeRef) => StyleTemplate,
        styleOrId,
        priority,
        TypeStyle.LylStyle);
    }
    return this._theme._createStyleContent2(styleOrId,
      null,
      priority,
      TypeStyle.LylStyle);
  }

  addClass(className: string) {
    if (!this._set.has(className)) {
      this._set.add(className);
      this._renderer.addClass(this._nEl, className);
    }
  }

  removeClass(className?: string | null) {
    if (className && this._set.has(className)) {
      this._set.delete(className);
      this._renderer.removeClass(this._nEl, className);
    }
  }

  toggleClass(className: string, enabled: boolean) {
    if (enabled) {
      this.addClass(className);
    } else {
      this.removeClass(className);
    }
  }

  updateClass(newClassName: string, oldClassName: string | null | undefined) {
    this.removeClass(oldClassName);
    this.addClass(newClassName);
    return newClassName;
  }

}

/**
 * Parameter decorator to be used for create Dynamic style together with `@Input`
 * @param style style
 * @param priority priority of style
 * @decorator
 */
export function Style<INPUT = any, C = any>(
  style: (val: NonNullable<INPUT>, comp: C) => ((theme: any, ref: ThemeRef) => StyleTemplate),
  priority?: number
) {

  return function(target: WithStyles, propertyKey: string, descriptor?: TypedPropertyDescriptor<INPUT>) {
    const index = `${__CLASS_NAME__}${propertyKey}`;
    if (descriptor) {
      const set = descriptor.set!;
      descriptor.set = function (val: INPUT) {
        const that: WithStyles = this;
        if (val == null) {
          that.sRenderer.removeClass(that[index]);
        } else {
          that[index] = that.sRenderer.add(
            `${getComponentName(that)}--${propertyKey}-${val}`,
            style(val as any, that as any),
            priority || that.$priority || (that.constructor as any).$priority || 0,
            that[index]
          );
        }
        set.call(that, val);
      };
    } else {
      Object.defineProperty(target, propertyKey, {
        configurable: true,
        enumerable: true,
        set(val: INPUT) {
          const that: WithStyles = this;
          if (val == null) {
            that.sRenderer.removeClass(that[index]);
          } else {
            that[`_${propertyKey}`] = val;
            that[index] = that.sRenderer.add(
              `${getComponentName(that)}--${propertyKey}-${val}`,
              style(val as NonNullable<INPUT>, that as any),
              priority || that.$priority || (that.constructor as any).$priority || 0,
              that[index]
            );
          }
        },
        get() {
          return this[`_${propertyKey}`];
        }
      });
    }
  };
}

export interface WithStyles {
  /** Style Priority, default: 0 */
  readonly $priority?: number;
  readonly sRenderer: StyleRenderer;
}

function getComponentName(comp: any) {
  return comp.constructor.и || comp.constructor.name || 'unnamed';
}
