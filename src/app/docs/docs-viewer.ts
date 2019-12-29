import { Component, Input, ElementRef, EventEmitter, Renderer2, Injector, isDevMode, ChangeDetectionStrategy } from '@angular/core';
import { observeOn, switchMap, takeUntil, take, catchError, tap } from 'rxjs/operators';
import { asapScheduler, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ElementsLoader } from './elements-loader.service';
import { Title, Meta } from '@angular/platform-browser';
import { LyTypographyVariables } from '@alyle/ui/typography';
import { ThemeVariables, LyTheme2, lyl, StyleCollection, StyleTemplate, Platform } from '@alyle/ui';
import { ViewComponent } from '@app/demo-view/view/view.component';
import { Router } from '@angular/router';
import { Ads, ADS_STYLES } from '@shared/ads';

// Initialization prevents flicker once pre-rendering is on
const initialDocViewerElement = Platform.isBrowser ? document.querySelector('aui-doc-viewer > div') : null;
let initialDocViewerContent = initialDocViewerElement ? initialDocViewerElement.innerHTML : '';

interface Err {
  title: string;
}

const STYLES = (theme: ThemeVariables & LyTypographyVariables) => {
  const { h3, h4, h5, h6, subtitle1, subtitle2 } = theme.typography.lyTyp!;
  const getStyle = (typ: StyleCollection<() => StyleTemplate> | (() => StyleTemplate)) => {
    return typ instanceof StyleCollection
      ? typ.setTransformer((_) => _())
      : typ();
  };
  return {
    root: lyl `{
      > div > {
        h1 {
          {
            ...${getStyle(h3!)}
          }
          font-size: ${theme.pxToRem(40)} !important
          margin: 1em 0
        }
        h2 {
          ...${getStyle(h4!)}
        }
        h3 {
          ...${getStyle(h5!)}
        }
        h4 {
          ...${getStyle(h6!)}
        }
        h5 {
          ...${getStyle(subtitle1!)}
        }
        h6 {
          ...${getStyle(subtitle2!)}
        }
      }
    }`
  };
};

@Component({
  selector: 'aui-doc-viewer',
  templateUrl: './doc-viewer.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocViewer {
  readonly classes = this.theme.renderStyleSheet(STYLES);
  readonly hostElement: HTMLElement;
  private onDestroy$ = new EventEmitter<void>();
  private docContents$ = new EventEmitter<string>();
  private void$ = of<void>(undefined);
  readonly isLoading = new EventEmitter<boolean>();
  readonly isError = new EventEmitter<Err | void>();

  ADS_STYLES = ADS_STYLES;

  @Input()
  get path() {
    return this._path;
  }
  set path(val: string) {
    if (val !== this.path) {
      this._path = val;
      if (val !== '/' && val !== '') {
        this.docContents$.emit(val);
      } else {
        this.setTitle();
        this.setNoIndex(false);
        this.hostElement.innerHTML = '';
      }
    }
  }
  private _path: string;

  constructor(
    injector: Injector,
    elementRef: ElementRef,
    private http: HttpClient,
    private elementsLoader: ElementsLoader,
    private titleService: Title,
    private metaService: Meta,
    private theme: LyTheme2,
    private renderer: Renderer2,
    private router: Router,
    private ads: Ads
  ) {
    this.isLoading.emit(!initialDocViewerContent);
    this.hostElement = renderer.createElement('div');
    renderer.appendChild(elementRef.nativeElement, this.hostElement);
    this.renderer.addClass(elementRef.nativeElement, this.classes.root);
    this.hostElement.innerHTML = initialDocViewerContent;

    if (Platform.isBrowser) {
      const { createCustomElement } = require('@angular/elements');
      const element = createCustomElement(ViewComponent, { injector });
      customElements.define('demo-view', element);
    }

    this.docContents$
      .pipe(
        observeOn(asapScheduler),
        switchMap(path => this.render(path)),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  onDestroy() {
    this.onDestroy$.emit();
  }

  render(path: string) {
    this.isLoading.emit(!initialDocViewerContent);
    if (!initialDocViewerContent) {
      this.hostElement.innerHTML = '';
    }
    this.isError.emit(null!);
    return this.void$
    .pipe(
      switchMap(async () => {
        return (path.startsWith('/api/@alyle/ui') || path === '/api')
          ? 'API'
          : (await Promise.all([
          this.http.get(`api/docs${path}.html`, {
            responseType: 'text'
          }).pipe(
            take(1),
            catchError((err: HttpErrorResponse | Error) => {
              this.hostElement.innerHTML = '';
              const errorMessage = (err instanceof Error) ? err.stack : err.message;
              const is404 = (err instanceof Error) ? false : err.status === 404;
              console.error('Err', errorMessage);
              this.isLoading.emit(false);
              this.setNoIndex(true);
              const errMsg = is404 ? 'PAGE NOT FOUND' : 'REQUEST FOR DOCUMENT FAILED';
              this.setTitle(`Alyle UI - ${errMsg}`);
              this.isError.emit({
                title: errMsg
              });
              return this.void$;
            }),
          ).toPromise(),
          this.elementsLoader.load(path)
        ]))[0];
      }),
      tap((html) => {
        if (html) {
          initialDocViewerContent = '';
          if (html !== 'API') {
            this.isLoading.emit(false);
            this.setNoIndex(false);
            const { hostElement } = this;
            hostElement.innerHTML = html;
            const h1 = hostElement.querySelector('h1');
            let title = (h1 && h1.textContent) || 'Untitled';
            if (path.includes('/components/')) {
              title = `${title} Angular Component`;
            }
            this.setTitle(`Alyle UI - ${title}`);
            // Show skeleton screen Platform is Server
            if (!Platform.isBrowser) {
              hostElement.innerHTML = '';
              this.isLoading.emit(true);
            }
            this.ads.update(path, this.theme);
          }
        }
      })
    );
  }

  /**
   * Tell search engine crawlers whether to index this page
   */
  setNoIndex(val: boolean) {
    if (val) {
      this.metaService.addTag({ name: 'robots', content: 'noindex' });
    } else {
      this.metaService.removeTag('name="robots"');
    }
  }

  setTitle(val?: string) {
    this.titleService.setTitle(val
      ? val
      : 'Alyle UI: Minimal Design, a set of components for Angular');

    if (Platform.isBrowser && !isDevMode()) {
      ga('set', 'page', this.router.url || '/');
      ga('send', 'pageview');
    }
  }
}
