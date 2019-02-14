import { Component, ChangeDetectionStrategy, Renderer2, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Router } from '@angular/router';
import { AUI_VERSION, LyTheme2, ThemeVariables, Platform } from '@alyle/ui';
import { LyIconService } from '@alyle/ui/icon';
import { LyDrawer } from '@alyle/ui/drawer';
import { CustomMinimaLight, CustomMinimaDark } from './app.module';
import { LySnackBar } from '@alyle/ui/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { AUIRoutes } from './routes';

const styles = (theme: ThemeVariables & CustomMinimaLight & CustomMinimaDark) => ({
  $name: 'app',
  '@global': {
    'body': {
      backgroundColor: theme.background.default,
      color: theme.text.default,
      fontFamily: theme.typography.fontFamily,
      margin: 0,
      direction: theme.direction
    },
  },
  appContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh)',
    '{demo}': {
      maxWidth: '960px',
      flex: 1,
      padding: '96px 2rem',
      width: '100%',
    }
  },
  demo: null,
  docsViewer: {
    p: {
      lineHeight: 1.5
    }
  },
  root: {
    display: 'block',
    '& .docs-viewer > * > a:not([ly-button]), & ul a:not([ly-button]), & p > a': {
      color: theme.accent.default,
      textDecoration: 'inherit',
      '&:hover': {
        textDecoration: 'underline'
      }
    },
  },
  // header: {
  //   position: 'fixed',
  //   zIndex: 11,
  //   width: '100%',
  //   // '@media print': {
  //   //   color: 'blue'
  //   // },
  //   // '&:hover': {
  //   //   '@media screen': {
  //   //     color: 'red'
  //   //   },
  //   // },
  // },
  drawer: {
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(0,0,0,.26)'
    },
    '&::-webkit-scrollbar': {
      height: '3px',
      width: '3px'
    }
  },
  drawerUl: {
    overflow: 'hidden',
    position: 'relative',
    listStyle: 'none',
    padding: '2rem 1.8rem',
    margin: 0,
    borderBottom: '1px solid rgba(0, 0, 0, 0.11)'
  },
  drawerButton: {
    color: theme.drawerButton,
    fontWeight: 400,
    borderBefore: '3px solid transparent',
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: 0,
    '&:hover, &{onLinkActive}': {
      color: theme.primary.default,
      borderBefore: '3px solid'
    }
  },
  onLinkActive: null,
  footer: {
    position: 'relative',
    padding: '1em',
    textAlign: 'center'
  },
  discordHover: {
    '&:hover': {
      color: theme.discord
    }
  }
});

@Component({
  selector: 'aui-root',
  templateUrl: './app.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(styles);
  routesComponents: any;
  version = AUI_VERSION;
  routes = AUIRoutes.slice(1);

  @ViewChild(LyDrawer) drawer: LyDrawer;
  @ViewChild(LySnackBar) sb: LySnackBar;

  constructor(
    private _el: ElementRef,
    public router: Router,
    private theme: LyTheme2,
    private renderer: Renderer2,
    sanitizer: DomSanitizer,
    iconService: LyIconService,
    updates: SwUpdate
  ) {
    if (Platform.isBrowser) {
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
  }
  ngOnInit() {
    this.renderer.addClass(this._el.nativeElement, this.classes.root);
  }

  reload() {
    document.location.reload();
  }
}
