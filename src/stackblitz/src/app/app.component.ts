import { lyl, StyleCollection, StyleRenderer, ThemeRef, ThemeVariables } from '@alyle/ui';
import { LyIconService } from '@alyle/ui/icon';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import type { AppThemeVariables } from './app.module';

export const STYLES = (theme: AppThemeVariables, ref: ThemeRef) => {
  const __ = ref.selectorsOf(STYLES);
  return {
    $global: () => lyl `{
      body {
        background-color: ${theme.background.default}
        color: ${theme.text.default}
        font-family: ${theme.typography.fontFamily}
        margin: 0
        direction: ${theme.direction}
      }
      ...${
        theme.exampleContainer?.(__)
      }
    }`,
    root: lyl `{
      display: block
    }`,
    exampleContainer: null
  };
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [
    StyleRenderer
  ]
})
export class AppComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES, true);
  title = 'my-app-77';
  constructor(
    readonly sRenderer: StyleRenderer,
    iconService: LyIconService,
    sanitizer: DomSanitizer
  ) {
    iconService.setSvg('Github', sanitizer.bypassSecurityTrustResourceUrl('assets/svg/github'));
    iconService.setSvg('Theme', sanitizer.bypassSecurityTrustResourceUrl('assets/svg/round-format_color_fill-24px'));
    iconService.setSvg('Discord', sanitizer.bypassSecurityTrustResourceUrl('assets/svg/discord'));
  }
}
