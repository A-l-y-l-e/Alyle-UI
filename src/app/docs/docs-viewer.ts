import { Directive, Input, ElementRef, EventEmitter, Renderer2, Injector, isDevMode } from '@angular/core';
import { observeOn, switchMap, takeUntil, take, catchError, tap } from 'rxjs/operators';
import { asapScheduler, EMPTY } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';

import { ElementsLoader } from './elements-loader.service';
import { ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN, ELEMENT_MODULE_LOAD_CALLBACKS } from './element-registry';
import { Title, Meta } from '@angular/platform-browser';
import { LyTypographyVariables } from '@alyle/ui/typography';
import { ThemeVariables, LyTheme2, lyl, StyleCollection, StyleTemplate, Platform } from '@alyle/ui';
import { ViewComponent } from '@app/demo-view/view/view.component';
import { Router } from '@angular/router';

// Initialization prevents flicker once pre-rendering is on
const initialDocViewerElement = document.querySelector('aui-doc-viewer');
const initialDocViewerContent = initialDocViewerElement ? initialDocViewerElement.innerHTML : '';

const STYLES = (theme: ThemeVariables & LyTypographyVariables) => {
  const { h3, h4, h5, h6, subtitle1, subtitle2 } = theme.typography.lyTyp!;
  const getStyle = (typ: StyleCollection<() => StyleTemplate> | (() => StyleTemplate)) => {
    return typ instanceof StyleCollection
      ? typ.setTransformer((_) => _())
      : typ();
  };
  return {
    root: lyl `{
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
    }`
  };
};

@Directive({
  selector: 'aui-doc-viewer',
  providers: [
    ElementsLoader,
    {
      provide: ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN,
      useValue: ELEMENT_MODULE_LOAD_CALLBACKS
    }
  ]
})
export class DocViewer {
  readonly classes = this.theme.renderStyleSheet(STYLES);
  private hostElement: HTMLElement;
  private onDestroy$ = new EventEmitter<void>();
  private docContents$ = new EventEmitter<string>();

  @Input()
  get path() {
    return this._path;
  }
  set path(val: string) {
    if (val !== this.path) {
      if (val && val !== '/') {
        this._path = val;
        this.docContents$.emit(val);
      } else {
        this.setTitle();
        this.setNoIndex(false);
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
    private router: Router
  ) {
    this.hostElement = elementRef.nativeElement;
    this.renderer.addClass(this.hostElement, this.classes.root);
    this.hostElement.innerHTML = initialDocViewerContent;

    const element = createCustomElement(ViewComponent, { injector });
    customElements.define('demo-view', element);

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
    return this.http.get(`docs${path}.html`, {
      responseType: 'text'
    })
    .pipe(
      take(1),
      catchError((err: HttpErrorResponse | Error) => {
        this.hostElement.innerHTML = '';
        const errorMessage = (err instanceof Error) ? err.stack : err;
        const is404 = (err instanceof Error) ? false : err.status === 404;
        console.error(errorMessage);
        this.setNoIndex(true);
        this.setTitle(`Alyle UI - ${is404 ? 'PAGE NOT FOUND' : 'REQUEST FOR DOCUMENT FAILED'}`);
        return EMPTY;
      }),
      switchMap(async r => {
        await this.elementsLoader.load(path);
        return r;
      }),
      tap((html) => {
        this.setNoIndex(false);
        const { hostElement } = this;
        hostElement.innerHTML = html;
        const h1 = hostElement.querySelector('h1');
        let title = (h1 && h1.innerText) || 'Untitled';
        if (path.includes('/components/')) {
          title = `${title} Angular Component`;
        }
        this.setTitle(`Alyle UI - ${title}`);
      })
    );
  }

  /**
   * Tell search engine crawlers whether to index this page
   */
  private setNoIndex(val: boolean) {
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
