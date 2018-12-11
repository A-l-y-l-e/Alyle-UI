import { Injectable } from '@angular/core';
import { LyTheme2, ThemeVariables, LY_COMMON_STYLES } from '@alyle/ui';

const tabsStyles = (theme: ThemeVariables) => ({
  root: {
    display: 'block'
  },
  container: {
    display: 'flex'
  },
  tab: {
    position: 'relative',
    display: 'inline-flex'
  },
  /** Tab content */
  contentContainer: {
    overflow: 'hidden',
    flexGrow: 1
  },
  /** Tab header */
  tabsLabels: {
    display: 'flex',
    position: 'relative'
  },
  label: {
    '-webkit-tap-highlight-color': 'transparent',
    '-webkit-appearance': 'none',
    backgroundColor: 'transparent',
    userSelect: 'none',
    border: 0,
    minWidth: '72px',
    padding: '0 24px',
    cursor: 'pointer',
    height: '48px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.pxToRem(theme.typography.fontSize),
    letterSpacing: '0.02857em',
    color: 'currentColor',
    outline: 'none',
    width: '100%',
    fontWeight: 500,
    opacity: .7,
    [theme.getBreakpoint('XSmall')]: {
      padding: '0 12px'
    }
  },
  tabLabelActive: {
    opacity: 1
  },
  tabContents: {
    display: 'flex',
    transition: '450ms cubic-bezier(.1, 1, 0.5, 1)',
    willChange: 'transform',
    height: '100%'
  },
  tabContent: {
    width: '100%',
    height: '100%',
    flexShrink: 0,
    position: 'relative'
  },
  tabsIndicator: {
    position: 'absolute',
    height: '2px',
    transition: '450ms cubic-bezier(.1, 1, 0.5, 1)',
    background: 'currentColor'
  },
  tabsIndicatorForServer: {
    position: 'absolute',
    background: 'currentColor'
  },
  rippleContainer: {
    ...LY_COMMON_STYLES.fill,
    overflow: 'hidden'
  }
});

@Injectable({
  providedIn: 'root'
})
export class LyTabsClassesService {
  classes = this.theme.addStyleSheet(tabsStyles);
  constructor(
    private theme: LyTheme2
  ) { }
}
