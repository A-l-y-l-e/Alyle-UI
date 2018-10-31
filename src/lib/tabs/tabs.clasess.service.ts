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
    flexGrow: 1,
    overflow: 'hidden'
  },
  label: {
    minWidth: '72px',
    padding: '0 24px',
    cursor: 'pointer',
    height: '48px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  tabContents: {
    display: 'flex',
    transition: '450ms cubic-bezier(.1, 1, 0.5, 1)',
    willChange: 'transform'
  },
  tabContent: {
    width: '100%',
    flexShrink: 0,
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
  classes = this.theme.addStyleSheet(tabsStyles);
  constructor(
    private theme: LyTheme2
  ) { }
}
