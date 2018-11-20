import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  ViewChild
} from '@angular/core';
import {
  LyCommon,
  LyRippleService,
  LyTheme2,
  mixinBg,
  mixinColor,
  mixinDisabled,
  mixinDisableRipple,
  mixinElevation,
  mixinFlat,
  mixinOutlined,
  mixinRaised,
  mixinShadowColor,
  mixinStyleUpdater,
  ThemeVariables,
} from '@alyle/ui';
import { LyIconButtonService } from './icon-button.service';


const STYLE_PRIORITY = -2;

const styles = (theme: ThemeVariables) => ({
  size: {
    width: theme.iconButton.size,
    height: theme.iconButton.size
  }
});

export class LyIconButtonBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone
  ) { }
}

export const LyIconButtonMixinBase = mixinStyleUpdater(
mixinBg(
  mixinFlat(
    mixinColor(
      mixinRaised(
        mixinDisabled(
          mixinOutlined(
            mixinElevation(
              mixinShadowColor(
                mixinDisableRipple(LyIconButtonBase))))))))));

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[ly-icon-button], a[ly-icon-button], span[ly-icon-button]',
  template: `
  <div [className]="iconButtonService.classes.content"
  ><ng-content></ng-content></div>
  <div #rippleContainer [className]="_rippleService.classes.container"></div>
  `,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lyIconButton'
})
export class LyIconButton extends LyIconButtonMixinBase implements OnInit, OnDestroy {
  classes = this.theme.addStyleSheet(styles, STYLE_PRIORITY);
  @ViewChild('rippleContainer') _rippleContainer: ElementRef;
  constructor(
    public _el: ElementRef,
    public _rippleService: LyRippleService,
    private renderer: Renderer2,
    @Optional() bgAndColor: LyCommon,
    public iconButtonService: LyIconButtonService,
    private theme: LyTheme2,
    ngZone: NgZone,
  ) {
    super(theme, ngZone);
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
    console.warn('deprecated, instead use `<button ly-button appearance="icon"`>');
  }

  ngOnInit() {
    this.renderer.addClass(this._el.nativeElement, this.iconButtonService.classes.root);
    this.renderer.addClass(this._el.nativeElement, this.classes.size);
  }

  ngOnDestroy() {
    this._removeRippleEvents();
  }
}

