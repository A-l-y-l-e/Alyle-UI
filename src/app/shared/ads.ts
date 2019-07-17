import { Injectable, Renderer2, RendererFactory2, isDevMode, NgZone } from '@angular/core';
import { Platform, LyTheme2 } from '@alyle/ui';
import { PageContentComponent } from '../page-content/page-content.component';
import { take } from 'rxjs/operators';

let count = -1;

@Injectable({
  providedIn: 'root'
})
export class Ads {
  private _renderer: Renderer2;

  constructor(
    private _ngZone: NgZone,
    rendererFactory: RendererFactory2) {
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  update(path: string, pageContent: PageContentComponent, theme: LyTheme2) {
    if (Platform.isBrowser) {
      count++;
      if (count > 0 || path !== '') {
        this._removeOld(pageContent);
        this._ngZone.onStable
          .asObservable()
          .pipe(take(1))
          .subscribe(() => {
            let ref = pageContent._getHostElement().querySelector('.ad');
            if (!ref) {
              ref = pageContent._getHostElement().querySelector('p');
            }
            if (!ref) {
              ref = pageContent._getHostElement().querySelector('demo-view');
            }
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
              if (path === '') {
                api += `theme=dark&template=centered`;
              } else {
                this._renderer.setStyle(Div, 'min-height', '64px');
                api += `theme=${themeNameForCodeFund}`;
              }
              CodeFundScript.src = api;
              CodeFundScript.async = 1;
              this._renderer.setAttribute(CodeFund, 'id', 'codefund');
              this._renderer.insertBefore(
                parentNode,
                Div,
                nextSibling
              );
              if (!isDevMode()) {
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

  private _removeOld(pageContent: PageContentComponent) {
    const container = pageContent._getHostElement().querySelector('#codefund');
    if (container) {
      this._renderer.removeChild(container.parentElement!.parentElement, container.parentElement);
    }
  }

}
