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
import { LyButtonService } from './button.service';
import { LyBgColorAndRaised } from '@alyle/ui';

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
export class LyButton implements AfterViewInit {
  public _disabled = false;
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

  @ViewChild(LyRipple) ripple: LyRipple;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
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

}
