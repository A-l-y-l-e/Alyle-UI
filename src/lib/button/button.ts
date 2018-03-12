import {
  NgModule,
  ModuleWithProviders,
  Component,
  Renderer,
  ElementRef,
  Output,
  Input,
  EventEmitter,
  ChangeDetectionStrategy,
  HostBinding,
  OnDestroy,
  Optional,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
  ContentChildren,
  QueryList,
  forwardRef,
  Directive,
  ViewChild,
  ContentChild,
  HostListener,
  OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Subscriber } from 'rxjs/Subscriber';
import { Subject }         from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LyRipple } from 'alyle-ui/ripple-minimal';
import { Observable } from 'rxjs/Observable';
import {
  LyTheme,
  themeProperty,
  Platform
 } from 'alyle-ui/core';
import { LyIconButton } from 'alyle-ui/icon-button';
import { LyShadowService } from 'alyle-ui/shadow';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Directive({ selector: '[ly-button][raised]' })
export class LyButtonRaised {
  private _raised = true;
  constructor() { }
}

@Component({
  selector: '[ly-button], ly-button',
  styleUrls: ['button.style.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[class._disabled]': '_disabled',
    '[class.ly-button-init]': '_hasButton()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="ly-button-ripple" lyRipple [lyRippleSensitive]="rippleSensitive"></div>
  <div class="ly-button-content" [style.font-family]="(theme.typography | async)?.fontFamily" [ngClass]="buttonPadding | async">
    <ng-content></ng-content>
  </div>
  `,
  preserveWhitespaces: false
})
export class LyButton implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  public _disabled = false;
  public _prevFocused = true;
  private html: any = '';
  private styleRipple: any;
  private size = 10;
  private distancefromV: any;
  private stateH = true;
  private timePress: any;
  private _color = 'colorText';
  private _deep: any = false;
  private _bg = 'rgba(0, 0, 0, 0)';
  private e: any;
  private colorString: string = null;
  private bgString: string = null;
  _subscription: Subscription;
  private _raised: string | boolean = false;
  nativeElement: HTMLElement;
  private _rippleSensitive = false;
  @HostBinding('style.box-shadow') boxShadow: any;
  @Input('sensitive')
  get rippleSensitive(): boolean {
    return this._rippleSensitive;
  }
  set rippleSensitive(value: boolean) {
    if (value === false) {
      this._rippleSensitive = false;
    } else {
      this._rippleSensitive = true;
    }
  }

  @HostBinding('style.background') styleBackground: string;
  @HostBinding('style.color') styleColor: string;
  @ViewChild(LyRipple) ripple: LyRipple;
  @ContentChildren(forwardRef(() => LyIconButton)) iconButton: QueryList<LyIconButton>;
  buttonPadding: Subject<string> = new BehaviorSubject<string>('');
  span = true;

  /** Callback registered via registerOnTouched (ControlValueAccessor) */
  private _onTouchedCallback: () => void;

  /** Callback registered via registerOnChange (ControlValueAccessor) */
  private _onChangeCallback: (_: any) => void;

  @HostBinding('class.ly-ripple-no-focus') lyRippleNoFocus = false;
  @HostListener('mousedown') onMouseDown() {
    this.lyRippleNoFocus = true;
  }
  @HostListener('blur') onBlur() {
    Promise.resolve().then(() => this.lyRippleNoFocus = false);
  }
  @HostListener('keydown') onKeydown() {
    this.lyRippleNoFocus = true;
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer,
    private sanitizer: DomSanitizer,
    private shadowService: LyShadowService,
    public theme: LyTheme,
    @Optional() private buttonRaised: LyButtonRaised,
  ) {
    this.nativeElement = this.elementRef.nativeElement;
    if (this.buttonRaised) {
      this._raised = true;
    }
    this.elementRef.nativeElement.tabIndex = 0;
  }
  @Input()
  public get raised(): string | boolean {
    return this._raised;
  }

  public set raised(val: string | boolean) {
    if (!!val) {
      this._raised = val;
    }
  }
  ngOnInit() {

    this._subscription = this.theme.palette.subscribe((colors: any) => {
      this.styleBackground = this.theme.colorOf(this._bg);
      // Actualizar color segun backgroundf
      if (themeProperty(this._bg)) {
        this.styleColor = '#fff';
      } else {
        this.styleColor = this.theme.colorOf(this._color);
      }
      this.shadowButton();
    });

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.shadowButton();
    if (changes.raised) {
      if (changes.raised.currentValue === false) {
        this.boxShadow = '#fff 0 0 0';
      }
    }
  }
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  public focused() {
    this.elementRef.nativeElement.focus();
  }
  private get btnWidth() {
    return this.elementRef.nativeElement.offsetWidth;
  }
  ngAfterViewInit() {
    const el: HTMLElement = this.elementRef.nativeElement;
    if (Platform.isBrowser) {
      this.ripple.setTriggerElement(el);
      Promise.resolve(null).then(() => {
        if (this.iconButton.length !== 0) {
          let left: string;
          let right: string;
          this.iconButton.forEach((iconButton: LyIconButton) => {
            const ele = iconButton.elementRef.nativeElement as HTMLElement;
            let eve: any = ele;
            while (eve = eve.previousSibling) {
              if (eve.nodeName === '#text' && eve.nodeValue.trim() !== '') {
                left = 'ly-button-padding-left';
              }
            }
            eve = ele;
            while (eve = eve.nextSibling) {
              if (eve.nodeName === '#text' && eve.nodeValue.trim() !== '') {
                right = 'ly-button-padding-right';
              }
              // this.buttonPadding.next(`${right}`);
              // this.buttonPadding.next(`${right}`);
            }
          });
          setTimeout(() => {
            right === right && this.iconButton.length === 2 ? this.buttonPadding.next(``) : this.buttonPadding.next(`${right || ''} ${left || ''}`);
          });
        } else {
          this.buttonPadding.next('ly-button-padding');
        }
      });
    }

  }
  private get btnHeight() {
    return this.elementRef.nativeElement.offsetHeight;
  }
  @Input()
  set bg(val: string) {
    this._bg = val;
    this.styleBackground = this.theme.colorOf(this._bg);
    if (themeProperty(this._bg)) {
      this.styleColor = '#fff';
    } else {
      this.styleColor = this.theme.colorOf(this._color);
    }
  }

  @Input('color')
  set color(val: string) {
    this._color = val;
    if (themeProperty(this._bg)) {
      this.styleColor = '#fff';
    } else {
      this.styleColor = this.theme.colorOf(this._color);
    }
  }
  @Input()
  public get deep(): any {
    return this._deep;
  }

  public set deep(val: any) {
    this._deep = val;
  }

  @Input()
  public get disabled(): boolean {
    return this._disabled;
  }

  public set disabled(val: boolean) {
    this._disabled = val;
    if (val) {
      this.elementRef.nativeElement.setAttribute('disabled', 'true');
    } else {
      this.elementRef.nativeElement.removeAttribute('disabled');
    }
  }
  public _hasButton() {
    return !!this.disabled || !!this.deep || !!this.bg  || !!this.color;
  }

  private sanitizerStyle(val: any): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(val);
  }

  private shadowButton() {
    const color = 'transparent';
    // !Important set boxShadow
    if (this._raised) {
      if (!!this._color && !!this.styleColor && !!this.styleBackground) {
        if (this._raised !== '!' && themeProperty(this._bg)) {
          this.boxShadow = (this.shadowService.shadow(this.styleBackground, 2.2));
        } else if (this._raised !== '!' && !themeProperty(this._bg)) {
          this.boxShadow = (this.shadowService.shadow(this.styleBackground, 2.2));
        } else {
          this.boxShadow = (this.shadowService.shadow(this.styleColor, 1));
        }
      }
    }
    // return this.sanitizerStyle(`${ color } 0px 3px 11px, ${ color } 0 2px 3px`);

  }
}
