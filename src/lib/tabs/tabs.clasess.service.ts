import { Injectable } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const tabsStyles = {
  root: {
    display: 'block',
    overflow: 'hidden'
  },
  tab: {
    position: 'relative',
    display: 'inline-flex'
  },
  tabsLabels: {
    display: 'flex',
    position: 'relative',
    'flex-grow': 1,
    overflow: 'hidden'
  },
  tabLabel: {
    'min-width': '72px',
    padding: '0 24px',
    cursor: 'pointer',
    height: '48px',
    display: 'inline-flex',
    'justify-content': 'center',
    'align-items': 'center'
  },
  tabContents: {
    display: 'flex',
    transition: '450ms cubic-bezier(.1, 1, 0.5, 1)',
    'will-change': 'transform'
  },
  tabContent: {
    width: '100%',
    'flex-shrink': 0,
    position: 'relative'
  },
  tabsIndicator: {
    position: 'absolute',
    transition: '450ms cubic-bezier(.1, 1, 0.5, 1)',
    bottom: 0,
    height: '2px',
    left: 0,
    background: 'currentColor'
  },
  tabsIndicatorForServer: {
    width: '100%'
  }
};

@Injectable({
  providedIn: 'root'
})
export class LyTabsClassesService {
  classes = this.theme.addStyleSheet(tabsStyles, 'lyTabs');
  constructor(
    private theme: LyTheme2
  ) { }
}
