import { Directive, Input, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { toBoolean, ThemeVariables, LyTheme2, getLyThemeVariableUndefinedError, lyl, ThemeRef, LyClasses, StyleTemplate, StyleContainer } from '@alyle/ui';
import { Subject } from 'rxjs';

export interface ExpansionConfig {
  root?: (classes: LyClasses<typeof STYLES>) => StyleTemplate;
  defaultConfig?: {
    appearance?: keyof ExpansionConfig['appearance']
  };
  appearance: {
    popOut: StyleContainer
  };
}
export interface ExpansionVariables {
  expansion?: ExpansionConfig;
}

const STYLE_PRIORITY = -0.9;

export const STYLES = (theme: ThemeVariables & ExpansionVariables, ref: ThemeRef) => {

  const classes = ref.getClasses(STYLES);

  const { after } = theme;

  return {
    $priority: STYLE_PRIORITY,
    $name: LyAccordion.и,
    $global: () => lyl `{
      ${classes.panelTitle}, ${classes.panelDescription} {
        display: flex
        margin-${after}: 16px
      }
      ${classes.panel}:not(${classes.disabled}) {
        ${classes.panelTitle} {
          color: ${theme.text.default}
        }
        ${classes.panelDescription} {
          color: ${theme.text.secondary}
        }
      }
    }`,
    root: (theme.expansion && theme.expansion.root) ? theme.expansion.root(classes) : null,
    panel: () => lyl `{
      display: block
      overflow: hidden
      position: relative
      &:not(${classes.disabled}) ${classes.panelHeader} {
        cursor: pointer
      }
    }`,
    panelHeader: () => lyl `{
      display: flex
      position: relative
      flex-direction: row
      align-items: center
      padding: 0 24px
      transition: height ${theme.animations.durations.entering}ms ${theme.animations.curves.standard}
      font-family: ${theme.typography.fontFamily}
      font-size: ${theme.pxToRem(15)}
      font-weight: 400
      ${classes.panel}:not(${classes.expanded}):not(${classes.disabled}) &:hover {
        background: ${theme.hover}
        @media (hover: none) {
          background: none
        }
      }
    }`,
    panelHeaderContent: lyl `{
      display: flex
      flex: 1
      flex-direction: row
      align-items: center
      overflow: hidden
    }`,
    panelContent: lyl `{
      display: flex
      flex-direction: column
      overflow: visible
    }`,
    panelBody: lyl `{
      visibility: hidden
      padding: 0 24px 16px
      transition: visibility ${
        theme.animations.durations.entering
      }ms ${
        theme.animations.curves.standard
      }
      font-family: ${theme.typography.fontFamily}
      font-size: ${theme.pxToRem(14)}
      font-weight: 400
      line-height: ${theme.pxToRem(20)}
    }`,
    panelTitle: lyl `{
      flex-grow: 1
    }`,
    panelDescription: lyl `{
      flex-grow: 2
    }`,
    panelActionRow: lyl `{
      border-top: 1px solid ${theme.divider}
      display: flex
      flex-direction: row
      justify-content: flex-end
      padding: 16px 8px 16px 24px
    }`,
    expanded: () => lyl `{
      ${classes.panelBody} {
        visibility: visible
      }
    }`,
    disabled: lyl `{
      color: ${theme.disabled.contrast}
    }`
  };
};

@Directive({
  selector: 'ly-accordion',
  exportAs: 'lyAccordion'
})
export class LyAccordion implements OnInit {

  /** @docs-private */
  static readonly и = 'LyAccordion';

  /** @docs-private */
  readonly classes = this._theme.addStyleSheet(STYLES);

  private _appearance: string;
  private _multiple: boolean;
  private _hasToggle = true;
  private _appearanceClass: string;

  /** Stream that emits true/false when openAll/closeAll is triggered. */
  readonly _openCloseAllActions: Subject<boolean> = new Subject<boolean>();

  @Input()
  set appearance(val: string) {
    this._appearance = val;
    this._appearanceClass = this._theme.addStyle(
      `lyAccordion.appearance:${val}`,
      (theme: ThemeVariables & ExpansionVariables) => {
        if (!(theme.expansion!.appearance && theme.expansion!.appearance[val])) {
          throw new Error(`Value expansion.appearance['${val}'] not found in ThemeVariables`);
        }
        return theme.expansion!.appearance[val]!;
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
  set multiple(val: boolean) {
    this._multiple = toBoolean(val);
  }
  get multiple() {
    return this._multiple;
  }

  @Input()
  set hasToggle(val: boolean) {
    this._hasToggle = toBoolean(val);
  }
  get hasToggle() {
    return this._hasToggle;
  }

  constructor(
    private _theme: LyTheme2,
    private _renderer: Renderer2,
    private _el: ElementRef) { }

  ngOnInit() {
    const { expansion } = <ExpansionVariables>this._theme.variables;
    if (expansion) {
      this._renderer.addClass(this._el.nativeElement, this.classes.root);

      // Apply default config
      if (expansion.defaultConfig && expansion.defaultConfig.appearance) {
        if (this.appearance == null) {
          this.appearance = expansion.defaultConfig.appearance;
        }
      }
    } else {
      throw getLyThemeVariableUndefinedError('expansion');
    }
  }

  closeAll() {
    this._openCloseAll(true);
  }

  openAll() {
    this._openCloseAll(false);
  }

  private _openCloseAll(expanded: boolean): void {
    if (this.multiple) {
      this._openCloseAllActions.next(expanded);
    }
  }

}
