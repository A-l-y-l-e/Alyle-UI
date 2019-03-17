import { Directive, Input, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { toBoolean, ThemeVariables, LyTheme2, getLyThemeVariableUndefinedError } from '@alyle/ui';
import { Subject } from 'rxjs';

const STYLE_PRIORITY = -0.9;

export const STYLES = (theme: ThemeVariables) => ({
  $priority: STYLE_PRIORITY,
  $name: 'expansion',
  '@global': {
    '{panelTitle},{panelDescription}': {
      display: 'flex',
      marginAfter: '16px',
    },
    '{panel}:not({disabled})': {
      '{panelTitle}': {
        color: theme.text.default
      },
      '{panelDescription}': {
        color: theme.text.secondary
      }
    }
  },
  root: null,
  panel: {
    display: 'block',
    overflow: 'hidden',
    position: 'relative',
    '&:not({disabled}) {panelHeader}': {
      cursor: 'pointer'
    }
  },
  panelHeader: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0 24px',
    transition: `height ${theme.animations.durations.entering}ms ${theme.animations.curves.standard}`,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.pxToRem(15),
    fontWeight: 400,
    '{panel}:not({expanded}):not({disabled}) &:hover': {
      background: theme.hover,
      '@media (hover: none)': {
        background: 'none'
      }
    }
  },
  panelHeaderContent: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
  },
  panelContent: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible'
  },
  panelBody: {
    visibility: 'hidden',
    padding: '0 24px 16px',
    transition: `visibility ${theme.animations.durations.entering}ms ${theme.animations.curves.standard}`,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.pxToRem(14),
    fontWeight: 400,
    lineHeight: theme.pxToRem(20)
  },
  panelTitle: {
    flexGrow: 1
  },
  panelDescription: {
    flexGrow: 2
  },
  panelActionRow: {
    borderTop: `1px solid ${theme.divider}`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: '16px 8px 16px 24px'
  },
  expanded: {
    '{panelBody}': {
      visibility: 'visible'
    }
  },
  disabled: {
    color: theme.disabled.contrast
  }
});

@Directive({
  selector: 'ly-accordion',
  exportAs: 'lyAccordion'
})
export class LyAccordion implements OnInit {

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
    const { expansion } = this._theme.variables;
    if (expansion && expansion.root) {
      this._renderer.addClass(
        this._el.nativeElement,
        this._theme.style(expansion.root, STYLE_PRIORITY, STYLES));
    }
    this._renderer.addClass(this._el.nativeElement, this.classes.root);
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
