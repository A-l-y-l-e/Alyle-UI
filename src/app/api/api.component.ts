import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Subscription, of, asapScheduler } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LyTheme2, Platform, lyl, StyleRenderer } from '@alyle/ui';

import { AppComponent } from '@app/app.component';
import { tap, map, catchError, observeOn, switchMap, takeUntil } from 'rxjs/operators';
import { Ads } from '@shared/ads';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { STYLES as API_LIST_CLASSES } from './api-list.component';
import { APIService, APIList } from './api.service';

const STYLES = () => {
  return {
    $priority: 1,
    header: lyl `{
      display: flex
      align-items: center
    }`,
    breadcrumbContainer: lyl `{
      display: flex
    }`,
    label: lyl `{
      width: initial
      padding: 4px 6px
      height: initial
      line-height: initial
      display: inline-flex
      align-items: center
      text-transform: uppercase
      &::before {
        content: ''
      }
    }`
  };
};

interface APIPkgSymbol {
  name: string;
  symbol: string;
  code: string;
}
interface APIPkgSymbolSanitized {
  name: string;
  symbol: string;
  code: SafeHtml;
}

interface APIPkgSymbolList {
  key: string;
  items: APIList[];
}

@Component({
  selector: 'aui-api',
  templateUrl: './api.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ]
})
export class ApiComponent implements OnInit, OnDestroy {
  readonly classes = this.sRenderer.renderSheet(STYLES);
  readonly apiListClasses = this.sRenderer.renderSheet(API_LIST_CLASSES);

  readonly doc$ = new EventEmitter<void>();
  doc: APIPkgSymbolSanitized | APIPkgSymbolList[] | null;
  private void$ = of<void>(undefined);
  routeParamsSubscription = Subscription.EMPTY;
  private onDestroy$ = new EventEmitter<void>();
  @ViewChild('code', { static: false }) code: ElementRef<HTMLDivElement>;
  constructor(
    readonly sRenderer: StyleRenderer,
    private http: HttpClient,
    public route: ActivatedRoute,
    public theme: LyTheme2,
    private apiService: APIService,
    location: Location,
    private sanitizer: DomSanitizer,
    private app: AppComponent,
    private ads: Ads,
    cdr: ChangeDetectorRef
  ) {
    this.doc$
      .pipe(
        observeOn(asapScheduler),
        switchMap(() => this.render(location.path())),
        takeUntil(this.onDestroy$)
      )
      .subscribe((data) => {
        this.doc = data;
        cdr.markForCheck();
      });
    this.routeParamsSubscription = this.route.url.pipe(takeUntil(this.onDestroy$)).subscribe(async () => {
      this.doc$.emit(null!);
    });
  }

  render(path: string) {
    return this.void$
      .pipe(
        tap(() => this.app.docViewer && this.app.docViewer.setNoIndex(true)),
        switchMap(async () => await
          this.http.get<APIPkgSymbol | APIPkgSymbolList[]>(`${path}.json`).pipe(catchError((error) => this.apiService.handleError(error))).toPromise()
        .catch((title: string) => {
          this.app.docViewer!.isError.emit({
            title
          });
          return null;
        })),
        map((data) => {
          if (data && (data as APIPkgSymbol).code) {
            return {
              ...data,
              code: this.sanitizer.bypassSecurityTrustHtml((data as APIPkgSymbol).code)
            } as APIPkgSymbolSanitized;
          }
          return data;
        }),
        tap((data) => {
          const { docViewer } = this.app;
          if (docViewer) {
            docViewer.isLoading.emit(false);
            if (data) {
              docViewer.setNoIndex(false);
              const splited = path.split('/').filter(_ => _);
              let title: string;
              if (splited.length === 3 || splited.length === 4) {
                title = path.replace('/api/', '');
              } else {
                title = splited.pop()!;
              }
              docViewer.setTitle(`Alyle UI - ${title}`);
            }
            // Show skeleton screen Platform is Server
            if (!Platform.isBrowser) {
              const { hostElement } = docViewer;
              hostElement.innerHTML = '';
              docViewer.isLoading.emit(true);
            }
            this.ads.update(path, this.theme);
          }
        })
      );
  }

  ngOnInit() {
  }

  ref(moduleName: string, path: string) {
    return `import { ${moduleName} } from '@alyle/ui/${path}';`;
  }

  inputTemplate(input: {name: string, type: string}) {
    return `@Input()\n${input.name}: ${input.type || 'any'}`;
  }

  ngOnDestroy() {
    this.onDestroy$.emit(null!);
    this.routeParamsSubscription.unsubscribe();
  }

  joinList(_) {
    return _.map(__ => __.children).join(`\n`);
  }

}
