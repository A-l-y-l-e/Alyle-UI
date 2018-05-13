import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  Optional,
  Renderer2,
  SimpleChanges,
  ViewChild,
  Inject
} from '@angular/core';
import {
  IsBoolean,
  LyTheme,
  Platform,
  StyleData,
  toBoolean,
  ThemeVariables
} from '@alyle/ui';
import { LyRipple, Ripple } from '@alyle/ui/ripple';
import { LyButtonService } from './button.service';
import { LyBgColorAndRaised } from '@alyle/ui';

@Component({
  selector: '[ly-button], ly-button',
  styleUrls: ['button.style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="ly-button-ripple" lyRipple [lyRippleSensitive]="rippleSensitive"></div>
  <!--<div class="ly-button-container">
    <ng-content select="[start]"></ng-content>-->
    <ng-content></ng-content>
    <!--<ng-content select="[end]"></ng-content>
  </div>-->
  `
})
export class LyButton implements AfterViewInit {
  public _disabled = false;
  private _rippleSensitive = false;
  private _disabledClassName: string;
  private _outlinedClassName: string;
  @Input()
  set outlined(val: boolean) {
    const classname = toBoolean(val) === true ? this.buttonService.classes.outlined : '';
    console.log('classname', classname);
    this.theme.updateClassName(this.elementRef.nativeElement, this.renderer, classname, this._outlinedClassName);
    this._outlinedClassName = classname;
  }
  @Input('sensitive')
  get rippleSensitive(): boolean {
    return this._rippleSensitive;
  }
  set rippleSensitive(value: boolean) {
    this._rippleSensitive = toBoolean(value);
  }

  @ViewChild(LyRipple) ripple: LyRipple;

  @Input()
  set disabled(value: boolean) {
    const key = this.bgAndColor && (this.bgAndColor.raised || this.bgAndColor.bg) ? 'r' : 'f';
    this._disabledClassName = this.theme.createStyle(`btn${key}`, this.disableStyle.bind(this)).id;
    this._disabled = toBoolean(value);
    if (this._disabled) {
      this.renderer.addClass(this.elementRef.nativeElement, this._disabledClassName);
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, this._disabledClassName);
    }
  }
  get disabled() {
    return this._disabled;
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private theme: LyTheme,
    private buttonService: LyButtonService,
    @Optional() private bgAndColor: LyBgColorAndRaised
  ) {
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
    this.buttonService.applyTheme(renderer, elementRef);
  }

  public focused() {
    this.elementRef.nativeElement.focus();
  }
  ngAfterViewInit() {
    if (Platform.isBrowser) {
     this.ripple.setTriggerElement(this.elementRef.nativeElement);
    }
  }

  private disableStyle() {
    let style =
    `box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;` +
    `cursor: default;` +
    `color: ${this.theme.palette.text.disabled} !important;` +
    `pointer-events: none;`;
    if (this.bgAndColor && (this.bgAndColor.raised || this.bgAndColor.bg)) {
      style += `background-color: ${this.theme.palette.button.disabled} !important;`;
    }
    return style;
  }

}
