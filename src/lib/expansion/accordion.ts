import { Directive, Input, ElementRef, OnInit, Renderer2 } from '@angular/core';
import {
  toBoolean,
  ThemeVariables,
  LyTheme2,
  getLyThemeVariableUndefinedError,
  ThemeRef,
  LyClasses,
  StyleTemplate } from '@alyle/ui';
import { Subject } from 'rxjs';

export interface ExpansionConfig {
  root?: (classes: LyClasses<typeof STYLES>) => StyleTemplate;
  defaultConfig?: {
    appearance?: keyof ExpansionConfig['appearance']
  };
  appearance: {
    popOut: (classes: LyClasses<typeof STYLES>) => StyleTemplate
  };
}
export interface ExpansionVariables {
  expansion?: ExpansionConfig;
}

const STYLE_PRIORITY = -0.9;

export const STYLES = (theme: ThemeVariables & ExpansionVariables, ref: ThemeRef) => {

  const classes = ref.selectorsOf(STYLES);
  const { after } = theme;

  return {
    $priority: STYLE_PRIORITY,
    $name: LyAccordion.и,
    $global: ( ) => (className: string) => `${className} ${classes.panelTitle},${className} ${classes.panelDescription}{display:flex;margin-${after}:16px;}${className} ${classes.panel}:not(${classes.disabled}) ${classes.panelTitle}{color:${theme.text.default};}${className} ${classes.panel}:not(${classes.disabled}) ${classes.panelDescription}{color:${theme.text.secondary};}`,
    root: (theme.expansion && theme.expansion.root) ? () => theme.expansion!.root!(classes) : null,
    panel: ( ) => (className: string) => `${className}{display:block;overflow:hidden;position:relative;}${className}:not(${classes.disabled}) ${classes.panelHeader}{cursor:pointer;}`,
    panelHeader: ( ) => (className: string) => `${className}{display:flex;position:relative;flex-direction:row;align-items:center;padding:0 24px;transition:height ${theme.animations.durations.entering}ms ${theme.animations.curves.standard};font-family:${theme.typography.fontFamily};font-size:${theme.pxToRem(15)};font-weight:400;}${classes.panel}:not(${classes.expanded}):not(${classes.disabled}) ${className}:hover{background:${theme.hover};}@media (hover: none){${classes.panel}:not(${classes.expanded}):not(${classes.disabled}) ${className}:hover{background:none;}}`,
    panelHeaderContent: (className: string) => `${className}{display:flex;flex:1;flex-direction:row;align-items:center;overflow:hidden;}`,
    panelContent: (className: string) => `${className}{display:flex;flex-direction:column;overflow:visible;}`,
    panelBody: (className: string) => `${className}{visibility:hidden;padding:0 24px 16px;transition:visibility ${
        theme.animations.durations.entering}ms ${
        theme.animations.curves.standard};font-family:${theme.typography.fontFamily};font-size:${theme.pxToRem(14)};font-weight:400;line-height:${theme.pxToRem(20)};}`,
    panelTitle: (className: string) => `${className}{flex-grow:1;}`,
    panelDescription: (className: string) => `${className}{flex-grow:2;}`,
    panelActionRow: (className: string) => `${className}{border-top:1px solid ${theme.divider};display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px;}`,
    expanded: ( ) => (className: string) => `${className} ${classes.panelBody}{visibility:visible;}`,
    disabled: (className: string) => `${className}{color:${theme.disabled.contrast};}`
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
      (theme: ThemeVariables & ExpansionVariables, ref: ThemeRef) => {
        if (!(theme.expansion!.appearance && theme.expansion!.appearance[val])) {
          throw new Error(`Value expansion.appearance['${val}'] not found in ThemeVariables`);
        }
        const classes = ref.selectorsOf(STYLES);
        return theme.expansion!.appearance[val]!(classes);
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
