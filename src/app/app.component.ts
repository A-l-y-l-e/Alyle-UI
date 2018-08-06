import { Component, VERSION, ChangeDetectionStrategy, OnDestroy, OnInit, Renderer2, ElementRef, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { AUI_VERSION, LyTheme2 } from '@alyle/ui';
import { RoutesAppService } from './components/routes-app.service';
import { Subscription } from 'rxjs';
import { LyIconService } from '@alyle/ui/icon';
import { MinimaLight } from '@alyle/ui/themes/minima';
import { DOCUMENT } from '@angular/platform-browser';

const linkActiveStyle = theme => (
  `color: ${theme.primary.default} !important;` +
  `border-left: 3px solid !important;`
);

const rootStyle = theme => (
  `background-color:${theme.background.default};` +
  `color:${theme.text.default};` +
  `font-family:${theme.typography.fontFamily};`
);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  linkActive;
  navMenu;
  routesComponents: any;
  angularVersion = VERSION;
  version = AUI_VERSION;
  routeState = false;
  mode = true;

  constructor(
    @Inject(DOCUMENT) _document: any,
    public router: Router,
    public routesApp: RoutesAppService,
    private theme: LyTheme2,
    renderer: Renderer2,
    elementRef: ElementRef,
    iconService: LyIconService
  ) {
    renderer.addClass((_document as Document).body, this.theme.setUpStyle('body', rootStyle));
    iconService.setSvg('Heart', 'assets/svg/Heart');
    iconService.setSvg('Experiment', 'assets/svg/Experiment');
    iconService.setSvg('Radiation', 'assets/svg/radiation');
    this.routesComponents = this.routesApp.routesApp;
  }
  changeScheme() {
    this.mode = !this.mode;
    const name = this.mode ? 'minima-light' : 'minima-dark';
    console.log(name);
    this.theme.setTheme(name);
  }

  ngOnInit() {
    this.linkActive = this.theme.setUpStyle<MinimaLight>(
      'nav-activatedRoute',
      linkActiveStyle
    );
    this.navMenu = this.theme.setUpStyle<MinimaLight>(
      'nav-ul',
      {
        '': () => (
          `overflow: hidden;` +
          `position: relative;` +
          `list-style: none;` +
          `padding: 2rem 1.8rem;` +
          `margin: 0;` +
          `border-bottom: 1px solid rgba(0, 0, 0, 0.11)`
        ),
        ' a': () => (
          `color: #5f6368;` +
          `font-weight: 400;` +
          `border-left: 3px solid transparent;`
        ),
        ' a:hover': linkActiveStyle
      }
    );
  }
}
