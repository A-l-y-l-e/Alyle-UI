import { Directive, Input } from '@angular/core';
import { ThemeVariables, keyframesUniqueId, lyl, StyleRenderer, Dir } from '@alyle/ui';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

const STYLE_PRIORITY = -0.5;
export const STYLES = (theme: ThemeVariables) => {
  const id = keyframesUniqueId.next();
  const { primary, secondary, tertiary } = theme.background;
  const dir = theme.direction === Dir.ltr ? -1 : 1;
  const lum = primary.default.luminance();
  let one = (lum < .5
    ? tertiary
    : secondary);
  let two = (lum < .5
    ? secondary
    : tertiary);
  one = one.darken(1 * (lum < .5 ? -.5 : 0));
  two = two.darken(.25 * (lum < .5 ? -1 : 1));

  return {
    $name: LySkeleton.и,
    $priority: STYLE_PRIORITY,
    $global: lyl `{
      @keyframes ${id} {
        0% {
          background-position: ${-dir * 200}% 50%
        }

        100% {
          background-position: ${dir * 200}% 50%
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
    StyleRenderer
  ],
  exportAs: 'lySkeleton',
  standalone: false
})
export class LySkeleton {
  /** @docs-private */
  static readonly и = 'LySkeleton';
  /** @docs-private */
  readonly classes = this.sRenderer.renderSheet(STYLES);

  @Input('lySkeleton')
  get skeleton() {
    return this._skeleton;
  }
  set skeleton(val: BooleanInput) {
    const newVal = coerceBooleanProperty(val);
    this._skeleton = newVal;
    this.sRenderer.toggleClass(this.classes.root, newVal);
  }
  private _skeleton: boolean;

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
}
