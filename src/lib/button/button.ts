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
  ViewChild
} from '@angular/core';
import {
  IsBoolean,
  LyTheme,
  Platform,
  StyleData
} from '@alyle/ui';
import { LyRipple, Ripple } from '@alyle/ui/ripple';
import { LyShadowService } from '@alyle/ui/shadow';
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
    private theme: LyTheme,
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
