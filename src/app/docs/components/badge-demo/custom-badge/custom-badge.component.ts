import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { lyl, ThemeVariables, ThemeRef, StyleRenderer } from '@alyle/ui';
import { STYLES as BUTTON_STYLES } from '@alyle/ui/button';

const STYLES = (theme: ThemeVariables, ref: ThemeRef) => {
  const button = ref.selectorsOf(BUTTON_STYLES);
  const { after } = theme;
  return {
    container: lyl `{
      display: flex
      justify-content: center
      ${button.root} {
        margin-${after}: 1em
      }
    }`,
    badge1: lyl `{
      border: 2px solid ${theme.background.tertiary}
      min-width: 20px
      height: 20px
      padding: 0 4px
    }`,
    badge2: lyl `{
      border: 2px solid ${theme.background.tertiary}
      min-width: 12px
      height: 12px
      padding: 0
    }`
  };
};

@Component({
  selector: 'aui-custom-badge',
  templateUrl: './custom-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ]
})
export class CustomBadgeComponent implements OnInit {
  readonly classes = this.sRenderer.renderSheet(STYLES);
  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

  ngOnInit() {
  }

}
