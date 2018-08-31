import { Component, VERSION, ChangeDetectionStrategy, Renderer2, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AUI_VERSION, LyTheme2 } from '@alyle/ui';
import { RoutesAppService } from './components/routes-app.service';
import { LyIconService } from '@alyle/ui/icon';
import { DOCUMENT } from '@angular/platform-browser';
import { LyDrawer } from '@alyle/ui/drawer';

const styles = theme => {
  const onLinkActive = {
    color: theme.primary.default,
    borderLeft: '3px solid'
  };
  return {
    body: {
      backgroundColor: theme.background.default,
      color: theme.text.default,
      fontFamily: theme.typography.fontFamily,
      margin: 0
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
    drawerContainer: {
      height: 'calc(100% - 64px)'
    },
    drawer: {
      width: '230px',
      height: 'calc(100% - 64px)',
      bottom: 0,
      padding: '1rem 0'
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
      color: '#5f6368',
      fontWeight: 400,
      borderLeft: '3px solid transparent',
      '&:hover': onLinkActive
    },
    onLinkActive
    // themePickerText: {
    //   paddingLeft: '8px'
    // }
  };
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  classes = this.theme.addStyleSheet(styles, 'root', 1);
  routesComponents: any;
  version = AUI_VERSION;
  routeState = false;

  @ViewChild(LyDrawer) drawer: LyDrawer;

  constructor(
    @Inject(DOCUMENT) private _document: any,
    public router: Router,
    public routesApp: RoutesAppService,
    private theme: LyTheme2,
    private renderer: Renderer2,
    iconService: LyIconService
  ) {
    iconService.setSvg('Theme', 'assets/svg/round-format_color_fill-24px');
    iconService.setSvg('Heart', 'assets/svg/Heart');
    iconService.setSvg('Experiment', 'assets/svg/Experiment');
    iconService.setSvg('Radiation', 'assets/svg/radiation');
    iconService.setSvg('Water', 'assets/svg/Water');
    this.routesComponents = this.routesApp.routesApp;
  }
  ngOnInit() {
    this.renderer.addClass((this._document as Document).body, this.classes.body);
  }

}

export type Classes<T> = Record<keyof ReturnType<(() => T)>, string>;
