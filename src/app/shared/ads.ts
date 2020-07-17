import { Injectable, Renderer2, RendererFactory2, isDevMode, NgZone } from '@angular/core';
import { LyTheme2, lyl, StyleCollection } from '@alyle/ui';
import { take } from 'rxjs/operators';
import { Platform } from '@angular/cdk/platform';
import { AUIThemeVariables } from '@app/app.module';



export const ADS_STYLES = () => lyl `{
  display: block
  position: relative
  margin-top: 32px
  margin-bottom: 24px
  min-height: 124px
}`;

export const STYLES = (theme: AUIThemeVariables) => {
  const { before } = theme;
  const { subheading, caption } = theme.typography.lyTyp!;
  return {
    $global: lyl `{
      #carbonads {
        padding: 12px 12px 12px 142px
        overflow: hidden
        background-color: ${theme.paper.default}
        a {
          color: inherit
          text-decoration: none
        }

        a:hover {
          color: inherit
        }

        .carbon-img {
          width: 130px
          height: 100px
          float: ${before}
          margin-${before}: -130px
        }

        .carbon-img img {
          display: block
        }

        .carbon-text {
          display: block
          padding-${before}: 12px
          padding-top: .5em
          ...${
            subheading instanceof StyleCollection
              ? subheading.setTransformer(fn => fn(subheading)).css
              : subheading()
          }
        }

        .carbon-poweredby {
          display: block
          padding-${before}: 12px
          line-height: 1
          color: ${theme.text.secondary}
          ...${
            caption instanceof StyleCollection
              ? caption.setTransformer(fn => fn(caption)).css
              : caption()
          }
        }
      }
    }`
  };
};

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
      if (( path !== '' && path !== '/')) {
        theme.renderStyleSheet(STYLES);
        this._ngZone.onStable
          .asObservable()
          .pipe(take(1))
          .subscribe(() => {
            const className = theme.renderStyle(ADS_STYLES);
            const ref = document.querySelector('aui-doc-viewer p');
            if (ref) {
              const Div = this._renderer.createElement('div');
              const CarbonScript = this._renderer.createElement('script');
              const nextSibling = this._renderer.nextSibling(ref);
              const parentNode = this._renderer.parentNode(ref);

              this._renderer.addClass(Div, className);
              CarbonScript.setAttribute('async', 'async');
              CarbonScript.setAttribute('type', 'text/javascript');
              CarbonScript.setAttribute('src', '//cdn.carbonads.com/carbon.js?serve=CEBDT2J7&placement=alyleio');
              CarbonScript.setAttribute('id', '_carbonads_js');
              this._renderer.insertBefore(
                parentNode,
                Div,
                nextSibling
              );
              if (isDevMode()) {
                this._renderer.appendChild(
                  Div,
                  CarbonScript
                );
              }
            }
          });
      }
    }
  }

}
