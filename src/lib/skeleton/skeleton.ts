import { Directive, Input } from '@angular/core';
import { ThemeVariables, keyframesUniqueId, lyl, LyHostClass, StyleRenderer, toBoolean } from '@alyle/ui';

const STYLE_PRIORITY = -0.5;
export const STYLES = (theme: ThemeVariables) => {
  const id = keyframesUniqueId.next();
  const { primary, secondary, tertiary } = theme.background;
  const lum = primary.default.luminance();
  let one = (lum < .5
    ? tertiary
    : secondary);
  let two = (lum < .5
    ? secondary
    : tertiary);
  one = one.darken(.25 * (lum < .5 ? -1 : 1));
  two = two.darken(.25 * (lum < .5 ? -1 : 1));
  return {
    $name: LySkeleton.и,
    $priority: STYLE_PRIORITY,
    $global: lyl `{
      @keyframes ${id} {
        0% {
          background-position: 200% 50%
        }

        100% {
          background-position: -200% 50%
        }
      }
    }`,
    root: lyl `{
      content: ''
      background: ${
        `linear-gradient(270deg, ${
          one
        }, ${
          two
        }, ${
          two
        }, ${
          one
        })`
      }
      background-size: 400% 400%
      animation: ${id} 8s ease-in-out infinite
      color: transparent
      cursor: progress
      user-select: none
    }`
  };
};

@Directive({
  selector: '[lySkeleton]',
  providers: [
    LyHostClass,
    StyleRenderer
  ],
  exportAs: 'lySkeleton'
})
export class LySkeleton {
  /** @docs-private */
  static readonly и = 'LySkeleton';
  /** @docs-private */
  readonly classes = this.styleRenderer.addSheet(STYLES);

  @Input('lySkeleton')
  get skeleton() {
    return this._skeleton;
  }
  set skeleton(val: boolean) {
    const newVal = toBoolean(val);
    this._skeleton = newVal;
    this.hostClass.toggle(this.classes.root, newVal);
  }
  private _skeleton: boolean;

  constructor(
    private styleRenderer: StyleRenderer,
    private hostClass: LyHostClass
  ) { }
}
