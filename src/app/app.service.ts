import { Injectable } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const GlobalStyles = theme => {
  const onLinkActive = {
    color: theme.primary.default,
    'border-left': '3px solid'
  };
  return {
    header: {
      position: 'fixed',
      'z-index': 11,
      width: '100%'
    },
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
      'list-style': 'none',
      padding: '2rem 1.8rem',
      margin: 0,
      'border-bottom': '1px solid rgba(0, 0, 0, 0.11)'
    },
    drawerButton: {
      color: '#5f6368',
      'font-weight': 400,
      'border-left': '3px solid transparent;',
      '&:hover': onLinkActive
    },
    onLinkActive,
  };
};

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private theme: LyTheme2
  ) {
    this.theme.addStyleSheet(GlobalStyles);
  }
}
