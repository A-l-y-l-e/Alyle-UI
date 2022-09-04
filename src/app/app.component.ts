import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Router, NavigationEnd } from '@angular/router';
import { AUI_VERSION, LyTheme2, ThemeVariables, ThemeRef, lyl, StyleRenderer } from '@alyle/ui';
import { LyIconService } from '@alyle/ui/icon';
import { LyDrawer } from '@alyle/ui/drawer';
import { CustomMinimaLight, CustomMinimaDark, AUIThemeVariables } from './app.module';
import { LySnackBar } from '@alyle/ui/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { AUIRoutes } from './routes';
import { Location } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { filter } from 'rxjs/operators';
import { PageContentComponent } from './page-content/page-content.component';
import { prismCustomClass } from './core/prism-custom-class';
import { SVG_ICONS } from './core/svg-icons';
import { DocViewer } from './docs/docs-viewer';

const STYLES = (theme: ThemeVariables & CustomMinimaLight & CustomMinimaDark, ref: ThemeRef) => {
  const classes = ref.selectorsOf(STYLES);
  const { before } = theme;
  return {
    $name: AppComponent.name,
    $global: lyl `{
      body {
        background-color: ${theme.background.default}
        color: ${theme.text.default}
        font-family: ${theme.typography.fontFamily}
        margin: 0
        direction: ${theme.direction}
      }
      a:not([ly-button]) {
        color: ${theme.accent.default}
        text-decoration: inherit
        &:hover {
          text-decoration: underline
        }
      }
    }`,
    root: lyl `{
      display: block
    }`,
    appContainer: ( ) => lyl `{
      display: flex
      align-items: center
      justify-content: center
      min-height: calc(100vh)
      ${classes.demo} {
        max-width: 960px
        min-height: 100vh
        flex: 1
        padding: 96px 2rem
        width: 100%
        box-sizing: border-box
      }
    }`,
    demo: null,
    docsViewer: lyl `{
      p {
        line-height: 1.5
      }
    }`,
    drawer: lyl `{
      &::-webkit-scrollbar {
        width: 16px
      }
      &::-webkit-scrollbar-thumb {
        background: ${
          (theme.background.primary.default.luminance() < 0.5
          ? theme.text.light
          : theme.text.dark).luminance(.5)
        }
        background-clip: padding-box
        border: 6px solid transparent
        -webkit-border-radius: 12px
        border-radius: 12px
        -webkit-box-shadow: none
        box-shadow: none
      }
      &::-webkit-scrollbar-track {
        background: none
        border: none
      }
    }`,
    drawerUl: lyl `{
      overflow: hidden
      position: relative
      list-style: none
      padding: 2rem 1.8rem
      margin: 0
      border-bottom: 1px solid rgba(0, 0, 0, 0.11)
    }`,
    drawerButton: () => lyl `{
      color: ${theme.drawerButton}
      font-weight: 400
      border-${before}: 3px solid transparent
      display: flex
      justify-content: space-between
      border-radius: 0
      &:hover, &${classes.onLinkActive} {
        color: ${theme.primary.default}
        border-${before}: 3px solid
      }
    }`,
    onLinkActive: null,
    footer: lyl `{
      position: relative
      padding: 1em
      text-align: center
    }`,
    discordHover: lyl `{
      &:hover {
        color: ${theme.discord}
      }
    }`
  };
};

function toClassSelector<T>(classes: T): T {
  const newClasses: object = { };
  for (const key in classes as unknown as object) {
    if ((classes as {}).hasOwnProperty(key)) {
      newClasses[key] = `.${classes[key]}`;
    }
  }
  return newClasses as unknown as T;
}

const PRISM_STYLES = (theme: AUIThemeVariables) => {
  const classes = toClassSelector(prismCustomClass());

  return {
    '@global': {
      [classes.pre]: {
        padding: '16px',
        [classes.code]: {
          display: 'block'
        }
      },
      [classes.inline]: {
        display: 'inline',
        borderRadius: '3px'
      },
      [[classes.pre, classes.inline].join()]: {
        backgroundColor: theme.codeBg,
      },
      [classes.code]: {
        padding: '4px 2px',
        color: theme.codeColor,
        fontFamily: `'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`,
        textAlign: 'left',
        fontSize: '0.8125em',
        fontWeight: 500,
        whiteSpace: 'pre',
        wordSpacing: 'normal',
        wordBreak: 'break-word',
        wordWrap: 'normal',
        lineHeight: 1.5,
        '-moz-tab-size': 4,
        '-o-tab-size': 4,
        tabSize: 4,
        '-webkit-hyphens': 'none',
        '-moz-hyphens': 'none',
        '-ms-hyphens': 'none',
        hyphens: 'none',
        overflow: 'auto',
        margin: '0',
        direction: 'ltr',
        [
          [
            classes.keyword,
            classes['selector-tag'],
            classes.title,
            classes.section,
            classes.doctag,
            classes.name,
            classes.strong
          ].map(c => `& ${c}`).join()
        ]: {
          color: theme.prism.keyword,
          fontWeight: '600'
        },
        [`${classes.comment}`]: {
          color: 'rgba(115, 129, 145, 0.65)'
        },
        [
          [
            classes.string,
            classes.title,
            classes.section,
            classes.built_in,
            classes.literal,
            classes.type,
            classes.addition,
            classes.tag,
            classes.quote,
            classes.name,
            classes['selector-id'],
            classes['selector-class'],
            classes.property
          ].map(c => `& ${c}`).join()
        ]: {
          color: theme.prism.keyword
        },
        [
          [
            classes.meta,
            classes.subst,
            classes.symbol,
            classes.regexp,
            classes.attribute,
            classes.deletion,
            classes.variable,
            classes['template-variable'],
            classes.link,
            classes.bullet
          ].map(c => `& ${c}`).join()
        ]: {
          color: '#4c81c9'
        },
        [`${classes.emphasis}`]: {
          fontStyle: 'italic'
        },
        [`${classes.function}`]: {
          color: '#4584ff'
        },
        [`& ${classes['attr-name']}`]: {
          color: '#FFB62C'
        },
        [`${classes['attr-value']}`]: {
          color: theme.prism.keyword
        },
        [`${classes.string}`]: {
          color: theme.prism.string
        },
        [`${classes.number}`]: {
          color: 'rgb(36, 212, 158)'
        },
        [`& ${classes.punctuation}, & ${classes.operator}`]: {
          color: '#9786c5'
        },
        [`& ${classes['class-name']}, & ${classes.selector}`]: {
          color: theme.accent.default.alpha(.88)
        },
        [`${classes.constant}`]: {
          color: '#EF5350'
        },
        [`${classes.builtin}`]: {
          color: '#8796b0'
        }
      }
    }
  };
};

@Component({
  selector: 'aui-root',
  templateUrl: './app.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ]
})
export class AppComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES, true);
  routesComponents: any;
  version = AUI_VERSION;
  routes = AUIRoutes.slice(1);
  currentRoutePath: string;

  @ViewChild(DocViewer) docViewer?: DocViewer;
  @ViewChild(LyDrawer, { static: true }) drawer: LyDrawer;
  @ViewChild(LySnackBar) sb: LySnackBar;
  @ViewChild(PageContentComponent, { static: true }) page: PageContentComponent;

  constructor(
    public router: Router,
    private theme: LyTheme2,
    readonly sRenderer: StyleRenderer,
    private _location: Location,
    sanitizer: DomSanitizer,
    iconService: LyIconService,
    updates: SwUpdate,
    platform: Platform
  ) {
    this.theme.addStyleSheet(PRISM_STYLES);
    if (platform.isBrowser) {
      updates.available.subscribe(event => {
        console.log('current version is', event.current);
        console.log('available version is', event.available);
        updates.activateUpdate().then(() => this.sb.open());
      });
    }
    iconService.setSvg('github', sanitizer.bypassSecurityTrustResourceUrl('assets/svg/social/social-color-1_logo-github'));
    iconService.setSvg('code', sanitizer.bypassSecurityTrustResourceUrl('assets/svg/code'));
    iconService.setSvg('Theme', sanitizer.bypassSecurityTrustResourceUrl('assets/svg/round-format_color_fill-24px'));
    iconService.setSvg('Heart', sanitizer.bypassSecurityTrustResourceUrl('assets/svg/Heart'));
    iconService.setSvg('Experiment', sanitizer.bypassSecurityTrustResourceUrl('assets/svg/Experiment'));
    iconService.setSvg('Radiation', sanitizer.bypassSecurityTrustResourceUrl('assets/svg/radiation'));
    iconService.setSvg('Water', sanitizer.bypassSecurityTrustResourceUrl('assets/svg/Water'));
    iconService.setSvg('Snow', sanitizer.bypassSecurityTrustResourceUrl('assets/svg/Snow'));
    iconService.setSvg('Discord', sanitizer.bypassSecurityTrustResourceUrl('assets/svg/social/discord'));
    iconService.setSvg('Palette', sanitizer.bypassSecurityTrustResourceUrl('assets/svg/palette'));

    SVG_ICONS.forEach(svg => iconService.addSvgIconLiteral(svg[0], sanitizer.bypassSecurityTrustHtml(svg[1])));

    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd)
    )
    .subscribe(() => {
      if (this.docViewer) {
        this.docViewer.path = this._location.path();
      }
      const pathname = platform.isBrowser
      ? location.pathname === '/'
        ? ''
        : location.pathname
      : this._location.path();
      this.currentRoutePath = pathname;
      this.page.updateRoute(pathname);
    });
  }

  reload() {
    document.location.reload();
  }
}
