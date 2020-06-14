import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ThemeVariables, StyleRenderer, lyl, keyframesUniqueId } from '@alyle/ui';

const STYLES = (theme: ThemeVariables) => {
  const circularRotate = keyframesUniqueId.next();
  const { after } = theme;
  return {
    $global: lyl `{
      @keyframes ${circularRotate} {
        0% {
          transform-origin: 50% 50%
        }
        100% {
          transform: rotate(360deg)
        }
      }
    }`,
    root: lyl `{
      button {
        margin-${after}: 1em
      }
    }`,
    spinner: lyl `{
      position: absolute
      width: 24px
      height: 24px
      animation: ${circularRotate} 1.4s linear infinite
    }`,
    spinnerCircle: lyl `{
      color: ${theme.disabled.contrast}
      stroke-dasharray: 80px, 200px
      stroke-dashoffset: 0px
      stroke: currentColor
    }`
  };
};

@Component({
  selector: 'aui-button-with-loading-state',
  templateUrl: './button-with-loading-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ]
})
export class ButtonWithLoadingStateComponent {

  readonly classes = this.sRenderer.renderSheet(STYLES, true);

  loading1 = false;
  loading2 = false;
  loading3 = false;

  load(loading: string) {
    this[loading] = true;
    setTimeout(() => {
      this[loading] = false;
      this._cd.markForCheck();
    }, 2000);
  }

  constructor(
    readonly sRenderer: StyleRenderer,
    private _cd: ChangeDetectorRef
  ) { }

}
