import { Directive, Input, ElementRef } from '@angular/core';
import { toBoolean, ThemeVariables, LyTheme2 } from '@alyle/ui';

export type LyAccordionAppearance = 'default' | 'flat';
const STYLE_PRIORITY = -2;

@Directive({
  selector: 'ly-accordion',
  exportAs: 'lyAccordion'
})
export class LyAccordion {
  private _appearance: LyAccordionAppearance;
  private _multiple: boolean;
  private _hasToggle: boolean;
  private _appearanceClass: string;

  @Input()
  set appearance(val: LyAccordionAppearance) {
    this._appearance = val;
    this._appearanceClass = this._theme.addStyle(
      `lyAccordion.appearance:${val}`,
      (theme: ThemeVariables) => {
        if (!(theme.expansion.appearance && theme.expansion.appearance[val])) {
          throw new Error(`Value expansion.appearance['${val}'] not found in ThemeVariables`);
        }
        return theme.expansion.appearance[val]!;
      },
      this._el.nativeElement,
      this._appearanceClass,
      STYLE_PRIORITY
    );
  }
  get appearance() {
    return this._appearance;
  }

  @Input()
  set multiple(val: boolean | '') {
    this._multiple = toBoolean(val);
  }
  get multiple() {
    return this._multiple;
  }

  @Input()
  set hasToggle(val: boolean | '') {
    this._hasToggle = toBoolean(val);
  }
  get hasToggle() {
    return this._hasToggle;
  }

  constructor(
    private _theme: LyTheme2,
    private _el: ElementRef) { }

}
