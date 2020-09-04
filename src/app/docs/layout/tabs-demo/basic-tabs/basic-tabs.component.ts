import { Component, ChangeDetectionStrategy } from '@angular/core';
import { lyl, ThemeVariables, ThemeRef, StyleRenderer, WithStyles, keyframesUniqueId } from '@alyle/ui';
import { STYLES as TABS_STYLES } from '@alyle/ui/tabs';

const STYLES = (_theme: ThemeVariables, ref: ThemeRef) => {
  ref.renderStyleSheet(TABS_STYLES);
  const tabs = ref.selectorsOf(TABS_STYLES);
  const fadeIn = keyframesUniqueId.next();
  const fadeOut = keyframesUniqueId.next();
  return {
    $global: lyl `{
      @keyframes ${fadeIn} {
        0% {
          opacity: 0
        }
        50% {
          opacity: 0
        }
        100% {
          opacity: 1
        }
      }

      @keyframes ${fadeOut} {
        0% {
          opacity: 1
        }
        50% {
          opacity: 0
        }
        100% {
          opacity: 0
        }
      }
    }`,
    root: lyl `{
      ${tabs.content} {
        animation: ${fadeOut} 0.5s
        opacity: 0
      }
      ${tabs.contentActive} {
        animation: ${fadeIn} 0.5s
        opacity: 1
      }
    }`
  };
};

@Component({
  selector: 'aui-basic-tabs',
  templateUrl: './basic-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ]
})
export class BasicTabsComponent implements WithStyles {
  readonly classes = this.sRenderer.renderSheet(STYLES, true);
  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
}