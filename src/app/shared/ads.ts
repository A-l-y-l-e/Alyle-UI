import { Injectable, Renderer2, RendererFactory2, isDevMode, NgZone } from '@angular/core';
import { LyTheme2, lyl } from '@alyle/ui';
import { take } from 'rxjs/operators';
import { Platform } from '@angular/cdk/platform';


let count = -1;

export const ADS_STYLES = () => lyl `{
  display: block
  position: relative
  max-width: 345px
  min-height: 130px
  margin-top: 32px
  margin-bottom: 24px
}`;

@Injectable({
  providedIn: 'root'
})
export class Ads {
  private _renderer: Renderer2;

  constructor(
    private _ngZone: NgZone,
    rendererFactory: RendererFactory2,
    private _platform: Platform
  ) {
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  update(path: string, theme: LyTheme2) {
    if (this._platform.isBrowser) {
      count++;
      if (count > 0 || ( path !== '' && path !== '/')) {
        this._removeOld();
        this._ngZone.onStable
          .asObservable()
          .pipe(take(1))
          .subscribe(() => {
            const className = theme.renderStyle(ADS_STYLES);
            const ref = document.querySelector('aui-doc-viewer p');
            if (ref) {
              const Div = this._renderer.createElement('div');
              const CodeFund = this._renderer.createElement('div');
              const CodeFundScript = this._renderer.createElement('script');
              const nextSibling = this._renderer.nextSibling(ref);
              const parentNode = this._renderer.parentNode(ref);
              const themeName = theme.variables.name;
              const themeNameForCodeFund = themeName.includes('light') ? 'light' : 'dark';
              let api = `https://codefund.app/properties/171/funder.js?`;

              this._renderer.appendChild(Div, CodeFund);
              if (path === '' || path === '/') {
                api += `theme=dark&template=centered`;
              } else {
                api += `theme=${themeNameForCodeFund}&template=default`;
              }
              this._renderer.addClass(Div, className);
              CodeFundScript.setAttribute('type', 'text/javascript');
              CodeFundScript.setAttribute('src', api);
              CodeFundScript.setAttribute('async', 'async');
              this._renderer.setAttribute(CodeFund, 'id', 'codefund');
              this._renderer.insertBefore(
                parentNode,
                Div,
                nextSibling
              );
              if (isDevMode()) {
                CodeFund.innerHTML = `<div style="padding: 1em">ads</div>`;
              } else {
                this._renderer.appendChild(
                  Div,
                  CodeFundScript
                );
              }
            }
          });
      }
    }
  }

  private _removeOld() {
    const container = document.querySelector('#codefund');
    if (container) {
      this._renderer.removeChild(container.parentElement!.parentElement, container.parentElement);
    }
  }

}
