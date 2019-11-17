import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  Renderer2,
  Component,
  ViewChild,
  forwardRef,
  QueryList,
  ContentChildren,
  ContentChild,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
  } from '@angular/core';
import {
  LY_COMMON_STYLES,
  LyFocusState,
  LyRippleService,
  LyTheme2,
  mixinBg,
  mixinColor,
  mixinDisabled,
  mixinDisableRipple,
  mixinElevation,
  mixinOutlined,
  mixinRaised,
  mixinShadowColor,
  mixinStyleUpdater,
  toBoolean,
  Platform,
  ThemeVariables,
  StyleCollection,
  LyClasses,
  StyleTemplate,
  lyl,
  ThemeRef
  } from '@alyle/ui';
import { LyAvatar } from '@alyle/ui/avatar';

export interface LyListTheme {
  /** Styles for List Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
}

export interface LyListVariables {
  list?: LyListTheme;
}

const STYLE_PRIORITY = 2;
const DISABLE_PADDING = false;
export const STYLES = (theme: ThemeVariables & LyListVariables, ref: ThemeRef) => {
  const list = ref.selectorsOf(STYLES);
  return {
    $name: LyList.и,
    $priority: STYLE_PRIORITY,
    root: ( ) => lyl `{
      display: block
      position: relative
      padding-top: 8px
      padding-bottom: 8px
      {
        ...${
          (theme.list
            && theme.list.root
            && (theme.list.root instanceof StyleCollection
              ? theme.list.root.setTransformer(fn => fn(list))
              : theme.list.root(list))
          )
        }
      }
    }`,
    listItem: ( ) => lyl `{
      ...${LY_COMMON_STYLES.button}
      font-family: ${theme.typography.fontFamily}
      font-size: ${theme.pxToRem(16)}
      color: ${theme.text.default}
      display: flex
      width: 100%
      position: relative
      padding: 0 16px
      min-height: 48px
      overflow: hidden
      text-align: left
      align-items: flex-start
      justify-content: flex-start
      border-radius: 0
      &::after {
        content: ''
        ...${LY_COMMON_STYLES.fill}
        width: 100%
        height: 100%
        background: transparent
        opacity: 0
        pointer-events: none
      },
      &${list.onFocusByKeyboard}::after, &${list.actionListItem}:hover::after {
        background: currentColor
        opacity: .13
        border-radius: inherit
      }
    }`,
    onFocusByKeyboard: null,
    listItemContent: lyl `{
      display: flex
      justify-content: inherit
      align-items: inherit
      align-content: inherit
      font-size: inherit
      width: 100%
      height: 100%
      box-sizing: border-box
    }`,
    oneLine: lyl `{
      padding-top: 8px
      padding-bottom: 8px
      min-height: 48px
    }`,
    twoLine: ( ) => lyl `{
      padding-top: 16px
      padding-bottom: 16px
      min-height: 64px
      ${list.lines} {
        margin-bottom: -4px
      }
    }`,
    actionListItem: lyl `{
      cursor: pointer
      user-select: none
    }`,
    lines: lyl `{
      align-self: stretch
      minWidth: 0
      width: 100%
      justify-content: center
      flex-direction: column
      display: flex
    }`,
    listItemWithIcon: ( ) => lyl `{
      ${list.lines} {
        padding-before: 16px
      }
    }`,
    twoLineWithIcon: ( ) => lyl `{
      padding-top: 16px
      padding-bottom: 16px
      ${list.lines} {
        margin-bottom: -4px
      }
    }`
  };
};

/** List container */
@Directive({
  selector: 'ly-list',
  exportAs: 'lyList',
  host: {
    '[className]': 'classes.root'
  }
})
export class LyList {
  static readonly и = 'LyList';
  /** @docs-private */
  readonly classes = this.theme.addStyleSheet(STYLES);
  constructor(
    private theme: LyTheme2
  ) { }
}

/** @docs-private */
export class LyListItemBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone
  ) { }
}

/** @docs-private */
export const LyListItemMixinBase = mixinStyleUpdater(
mixinBg(
    mixinColor(
      mixinRaised(
        mixinDisabled(
          mixinOutlined(
            mixinElevation(
              mixinShadowColor(
                mixinDisableRipple(LyListItemBase)))))))));

/** List Item */
@Component({
  selector: 'ly-list-item, a[ly-list-item], button[ly-list-item]',
  templateUrl: './list-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: [
    'bg',
    'color',
    'raised',
    'disabled',
    'outlined',
    'elevation',
    'shadowColor',
    'disableRipple'
  ],
  exportAs: 'lyListItem'
})
export class LyListItem extends LyListItemMixinBase implements OnInit, AfterContentInit, OnDestroy {
  /** @docs-private */
  readonly classes = this._list.classes;
  readonly _isBrowser = Platform.isBrowser;
  private _isActionListItem: boolean;
  private _onFocusByKeyboardState: boolean;

  @ViewChild('rippleContainer', { static: false }) _rippleContainer: ElementRef;
  @ContentChildren(forwardRef(() => LyLine)) _lines: QueryList<LyLine>;
  @ContentChild(forwardRef(() => LyListIcon), { static: false }) _icon: LyListIcon & { };
  @ContentChild(LyAvatar, { static: false }) _avatar: LyAvatar;
  get _listItemClasses() {
    const { listItemContent, twoLine, oneLine, listItemWithIcon, twoLineWithIcon } = this.classes;
    const classes = [listItemContent];
    const hasIcon = this._icon || this._avatar;
    if (hasIcon) {
      classes.push(listItemWithIcon);
    }
    if (this._lines && this._lines.length) {
      if (hasIcon && this._lines.length > 1) {
        classes.push(twoLineWithIcon);
      } else {
        classes.push(this._lines.length > 1 ? twoLine : oneLine);
      }
    }
    return classes;
  }
  /** @docs-private */
  @Input('ly-list-item')
  set isActionListItem(val: any) {
    this._isActionListItem = toBoolean(val);
  }
  get isActionListItem() {
    return this._isActionListItem;
  }
  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2,
    theme: LyTheme2,
    ngZone: NgZone,
    public _rippleService: LyRippleService,
    private _focusState: LyFocusState,
    private _list: LyList,
    private _cd: ChangeDetectorRef
  ) {
    super(theme, ngZone);
    this.setAutoContrast();
    this._triggerElement = _el;
  }

  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, this._list.classes.listItem);
    if (this.disableRipple == null) {
      if (this.isActionListItem) {
        this._renderer.addClass(this._el.nativeElement, this.classes.actionListItem);
        this.disableRipple = false;
        const focusState = this._focusState.listen(this._el);
        if (focusState) {
          focusState.subscribe((event) => {
            if (this._onFocusByKeyboardState === true) {
              this._renderer.removeClass(this._el.nativeElement, this.classes.onFocusByKeyboard);
              this._onFocusByKeyboardState = false;
            }
            if (event === 'keyboard') {
              this._onFocusByKeyboardState = true;
              this._renderer.addClass(this._el.nativeElement, this.classes.onFocusByKeyboard);
            }
          });
        }
      }
    }
  }

  ngAfterContentInit() {
    this._lines.changes.subscribe(() => this._cd.markForCheck());
  }

  ngOnDestroy() {
    this._focusState.unlisten(this._el);
  }
}

@Directive({
  selector: '[ly-list-icon]'
})
export class LyListIcon implements OnInit {
  private _disablePadding: boolean;
  private _disablePaddingClass: string;

  /** Disable extra padding */
  @Input()
  set disablePadding(val: any) {
    const newVal = this._disablePadding = toBoolean(val);
    this._disablePaddingClass = this._theme.addStyle(`lyIconPadding:${newVal.toString()}`, () => (
      {
        paddingTop: newVal ? '4px' : '8px',
        paddingBottom: newVal ? '4px' : '8px'
      }
    ));
    this._renderer.addClass(this._el.nativeElement, this._disablePaddingClass);
  }
  get disablePadding() {
    return this._disablePadding;
  }
  constructor(
    private _theme: LyTheme2,
    private _el: ElementRef,
    private _renderer: Renderer2,
  ) {
    this._renderer.addClass(
      this._el.nativeElement,
      this._theme.addSimpleStyle(
        'lyListIcon',
        (theme: ThemeVariables) => ({
          color: theme.text.secondary,
          paddingAfter: '16px'
        }),
        STYLE_PRIORITY
      )
    );
  }

  ngOnInit() {
    if (this.disablePadding == null) {
      this.disablePadding = DISABLE_PADDING;
    }
  }
}

@Directive({
  selector: '[ly-line]'
})
export class LyLine {
  constructor(
    private _theme: LyTheme2,
    private _el: ElementRef,
    private _renderer: Renderer2,
  ) {
    this._renderer.addClass(
      this._el.nativeElement,
      this._theme.addSimpleStyle(
        'lyLine',
        (theme: ThemeVariables) => ({
          margin: 0,
          padding: 0,
          fontWeight: 400,
          textAlign: 'initial',
          '&:first-child': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1,
            fontSize: theme.pxToRem(16)
          },
          '&:nth-child(n+2)': {
            lineHeight: '20px',
            fontSize: theme.pxToRem(14)
          }
        }),
        STYLE_PRIORITY
      )
    );
  }
}
