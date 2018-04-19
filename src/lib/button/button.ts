import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  ModuleWithProviders,
  NgModule,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild
  } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import {
  IsBoolean,
  LyBg,
  LyColor,
  LyTheme,
  Platform,
  themeProperty
  } from 'alyle-ui/core';
import { LyIconButton } from 'alyle-ui/icon-button';
import { LyRipple } from 'alyle-ui/ripple-minimal';
import { LyShadowService } from 'alyle-ui/shadow';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscriber,
  Subscription
} from 'rxjs';

// @Directive({ selector: '[ly-button][raised]' })
// export class LyButtonRaised {
//   private _raised = true;
//   constructor() { }
// }

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
  private _lastClass: string;
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

  @Input() color: string;
  @Input() bg: string;
  @Input() @IsBoolean() raised: boolean;
  @Input() @IsBoolean() raisedColorInverted: string;

  @HostBinding('style.background') styleBackground: string;
  @HostBinding('style.color') styleColor: string;
  @ViewChild(LyRipple) ripple: LyRipple;
  @ContentChildren(forwardRef(() => LyIconButton)) iconButton: QueryList<LyIconButton>;
  buttonPadding: Subject<string> = new BehaviorSubject<string>('');
  span = true;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private shadowService: LyShadowService,
    public theme: LyTheme,
    @Optional() private lyColor: LyColor,
    @Optional() private lyBg: LyBg
  ) {
    this.nativeElement = this.elementRef.nativeElement;
  }
  ngOnInit() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.raised || this.raisedColorInverted) {
      let colorRaised = this.bg || this.color || '';
      if (this.raisedColorInverted) {
        colorRaised = this.color;
      }
      this._lastClass = this.shadowService.setShadow(this.elementRef, this.renderer, ['3', colorRaised], this._lastClass);
    } else if (this._lastClass) {
      /** reset */
      this.renderer.removeClass(this.elementRef.nativeElement, this._lastClass);
      this._lastClass = null;
    }
  }
  ngOnDestroy() { }

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
}
