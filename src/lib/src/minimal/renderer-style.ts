import { Injectable, ElementRef, Renderer2, Optional } from '@angular/core';
import { LyTheme2, ThemeRef } from '../theme/theme2.service';
import { StyleTemplate } from '../parse';
import { TypeStyle, LyStyles, LyClasses } from '../theme/style';

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
   *   root: lyl `{...}`, // this class will be added to the root component
   *   item: lyl `{...}`
   * })
   * ```
   *
   * Also accepts the name of a class.
   *
   * e.g.
   *
   * ```ts
   * renderSheet(STYLES, 'item')
   * ```
   */
  renderSheet<T>(styles: T & LyStyles, applyRootClass?: boolean | keyof LyClasses<T>): LyClasses<T> {
    const classes = this._theme.renderStyleSheet(styles);
    if (applyRootClass === true && (classes as any).root) {
      this.addClass((classes as any).root);
      return classes;
    }
    if (applyRootClass) {
      const customClass = (classes as any)[applyRootClass];
      if (customClass) {
        this.addClass(customClass);
      }
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

export type InputStyle<INPUT, C> = (val: NonNullable<INPUT>, comp: C) => (((theme: any, ref: ThemeRef) => StyleTemplate) | null);

/**
 * Parameter decorator to be used for create Dynamic style together with `@Input`
 * @param style style
 * @decorator
 */
export function Style<INPUT = any, C = any>(
  style: InputStyle<INPUT, C>
): (target: WithStyles, propertyKey: string, descriptor?: TypedPropertyDescriptor<INPUT> | undefined) => void;

/**
 * Parameter decorator to be used for create Dynamic style together with `@Input`
 * @param style style
 * @decorator
 */
export function Style<INPUT = any, C = any>(
  style: InputStyle<INPUT, C>,
  priority: number
): (target: WithStyles, propertyKey: string, descriptor?: TypedPropertyDescriptor<INPUT> | undefined) => void;

/**
 * Parameter decorator to be used for create Dynamic style together with `@Input`
 * @param style style
 * @param priority priority of style, default: 0
 * @decorator
 */
export function Style<INPUT = any, C = any>(
  style: InputStyle<INPUT, C>,
  priority?: number
) {

  return function(target: WithStyles, propertyKey: string, descriptor?: TypedPropertyDescriptor<INPUT>) {
    // const _propertyKeyClass = `_${propertyKey}Class`;
    const _propertyKey = `_${propertyKey}`;
    if (descriptor) {
      const set = descriptor.set!;
      descriptor.set = function (val: INPUT) {
        createStyle(
          this,
          propertyKey,
          val,
          style,
          priority
        );
        set.call(this, val);
      };
      if (!descriptor.get) {
        descriptor.get = function () {
          return this[_propertyKey];
        };
      }
    } else {
      Object.defineProperty(target, propertyKey, {
        configurable: true,
        enumerable: true,
        set(val: INPUT) {
          createStyle(
            this,
            propertyKey,
            val,
            style,
            priority
          );
        },
        get() {
          return this[_propertyKey];
        }
      });
    }
  };
}

/**
 * Create a style for component with a key
 * @param c The component
 * @param propertyKey Style key
 * @param val value
 * @param style style template
 * @param priority priority of style
 */
export function createStyle<INPUT, C>(
  c: WithStyles,
  propertyKey: string,
  val: INPUT,
  style: InputStyle<INPUT, C>,
  priority?: number
) {
  const _propertyKeyClass = `_${propertyKey}Class`;
  const _propertyKey = `_${propertyKey}`;
  const oldValue = c[_propertyKey];
  c[_propertyKey] = val;
  const styleTemplate = style(val as NonNullable<INPUT>, c as any);
  if ((val as any) === false || val == null || styleTemplate == null) {
    c.sRenderer.removeClass(c[_propertyKeyClass]);
  } else if (oldValue !== val) {
    c[_propertyKeyClass] = c.sRenderer.add(
      `${getComponentName(c)}--${propertyKey}-${val}`,
      styleTemplate,
      priority ?? c.$priority ?? (c.constructor as any).$priority ?? 0,
      c[_propertyKeyClass]
    );
  }
}

export interface WithStyles {
  /** Style Priority, default: 0 */
  readonly $priority?: number;
  readonly sRenderer: StyleRenderer;
}

function getComponentName(comp: any) {
  return comp.constructor.и || comp.constructor.name || 'unnamed';
}
