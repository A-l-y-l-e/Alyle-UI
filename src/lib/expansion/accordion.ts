import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { toBoolean, ThemeVariables, LyTheme2, getLyThemeVariableUndefinedError } from '@alyle/ui';

export type LyAccordionAppearance = 'default' | 'flat';
const STYLE_PRIORITY = -2;

const STYLES = (theme: ThemeVariables) => ({
  panel: {
    display: 'block',
    overflow: 'hidden',
    background: theme.paper.default,
    '&:not({disabled}) {panelHeader}': {
      cursor: 'pointer'
    }
  },
  panelHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0 24px',
    transition: `height ${theme.animations.durations.entering}ms ${theme.animations.curves.standard}`
  },
  panelContent: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible'
  },
  panelBody: {
    visibility: 'hidden',
    padding: '0 24px 16px',
    transition: `visibility ${theme.animations.durations.entering}ms ${theme.animations.curves.standard}`
  },
  expanded: {
    '{panelBody}': {
      visibility: 'visible'
    }
  },
  disabled: {
    background: theme.disabled.default,
    color: theme.disabled.contrast
  }
});

@Directive({
  selector: 'ly-accordion',
  exportAs: 'lyAccordion'
})
export class LyAccordion implements OnInit {

  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);

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
        if (!theme.expansion) {
          throw getLyThemeVariableUndefinedError('expansion');
        }
        if (!(theme.expansion.appearance && theme.expansion.appearance[val])) {
          throw new Error(`Value expansion.appearance['${val}'] not found in ThemeVariables`);
        }
        return theme.expansion.appearance[val]!;
      },
      this._el.nativeElement,
      this._appearanceClass,
      STYLE_PRIORITY,
      STYLES
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

  ngOnInit() {
    if (this.appearance == null) {
      this.appearance = 'default';
    }
  }

}
