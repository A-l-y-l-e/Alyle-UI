import {
  Directive,
  Optional,
  Renderer2,
  ElementRef,
  Input,
  OnInit
} from '@angular/core';
import { LyCommon, LyTheme2, ThemeVariables } from '@alyle/ui';

const STYLE_PRIORITY = -2;
const DEFAULT_POSITION = 'fixed';
const DEFAULT_BG = 'background:tertiary';

const styles = (theme: ThemeVariables) => ({
  root: {
    padding: '0 16px',
    display: 'flex',
    boxSizing: 'border-box',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    height: '64px',
    zIndex: theme.zIndex.toolbar,
    [theme.getBreakpoint('XSmall')]: {
      height: '56px'
    }
  }
});

type position = 'static' | 'absolute' | 'fixed' | 'sticky' | 'relative';

@Directive({
  selector: 'ly-toolbar'
})
export class LyToolbar implements OnInit {
  classes = this.theme.addStyleSheet(styles, STYLE_PRIORITY);
  private _position: position;
  private _positionClass: string;
  @Input()
  set position(val: position) {
    this._position = val;
    this._positionClass = this.theme.addStyle(`ly-toolbar-position:${val}`, `position:${val}`, this._el.nativeElement, this._positionClass, STYLE_PRIORITY);
  }
  get position() {
    return this._position;
  }
  constructor(
    renderer: Renderer2,
    private _el: ElementRef,
    private theme: LyTheme2,
    @Optional() private _common: LyCommon
  ) {
    renderer.addClass(this._el.nativeElement, this.classes.root);
    if (this._common) {
      this._common.setAutoContrast();
    }
  }

  ngOnInit() {
    if (!this.position) {
      this.position = DEFAULT_POSITION;
    }
    if (!this._common.bg) {
      this._common.bg = DEFAULT_BG;
      this._common.ngOnChanges();
    }
  }
}
