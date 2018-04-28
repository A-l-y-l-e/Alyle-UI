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
  ViewChild,
  NgZone
  } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import {
  IsBoolean,
  LyTheme,
  Platform,
  themeProperty,
  StyleData
  } from '@alyle/ui';
import { LyIconButton } from '@alyle/ui/icon-button';
import { LyRipple, Ripple } from '@alyle/ui/ripple';
import { LyShadowService } from '@alyle/ui/shadow';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscriber,
  Subscription
} from 'rxjs';
import { LyButtonService } from './button.service';
import { LyBgAndColor } from '@alyle/ui';

@Component({
  selector: '[ly-button], ly-button',
  styleUrls: ['button.style.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[class._disabled]': '_disabled',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="ly-button-ripple" lyRipple [lyRippleSensitive]="rippleSensitive"></div>
  <div class="ly-button-container">
    <ng-content select="[start]"></ng-content>
    <ng-content select="[end]"></ng-content>
    <span class="ly-button-content"><ng-content></ng-content></span>
  </div>
  `
})
export class LyButton implements AfterViewInit, OnChanges {
  private _currentStyleData: StyleData;
  public _disabled = false;
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

  @ViewChild(LyRipple) ripple: LyRipple;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private shadowService: LyShadowService,
    public theme: LyTheme,
    private buttonService: LyButtonService,
    @Optional() private bgAndColor: LyBgAndColor
  ) {
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
    this.buttonService.applyTheme(renderer, elementRef);
    this.nativeElement = this.elementRef.nativeElement;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.raised || this.raisedColorInverted) {
      let colorRaised = this.bg || this.color || '';
      if (this.raisedColorInverted) {
        colorRaised = this.color;
      }
      this._currentStyleData = this.shadowService.setShadow(this.elementRef, this.renderer, ['3', colorRaised], this._currentStyleData);
    } else if (this._currentStyleData) {
      /** reset */
      this.renderer.removeClass(this.elementRef.nativeElement, this._currentStyleData.id);
      this._currentStyleData = null;
    }
  }

  public focused() {
    this.elementRef.nativeElement.focus();
  }
  ngAfterViewInit() {
    if (Platform.isBrowser) {
     this.ripple.setTriggerElement(this.elementRef.nativeElement);
    }
  }

}
