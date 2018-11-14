import { ThemeVariables } from '@alyle/ui';

export const styles = (theme: ThemeVariables) => {
  const typography = theme.typography;
  const _styles = ({
    root: {
      fontFamily: typography.fontFamily,
      color: theme.text.default,
      '-webkit-tap-highlight-color': 'transparent',
      backgroundColor: `rgba(0, 0, 0, 0)`,
      border: 0,
      padding: '0 1em',
      '-moz-appearance': 'none',
      margin: 0,
      borderRadius: '3px',
      outline: 'none',
      fontWeight: 500,
      boxSizing: 'border-box',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      display: 'inline-flex',
      cursor: 'pointer',
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
      userSelect: 'none',
      textDecorationLine: 'none',
      '-webkit-text-decoration-line': 'none',
      '&::-moz-focus-inner, &::-moz-focus-inner': {
        border: 0
      },
      ...typography.lyTyp.button
    },
    content: {
      padding: 0,
      display: 'flex',
      justifyContent: 'inherit',
      alignItems: 'inherit',
      alignContent: 'inherit',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box'
    },
    animations: {
      '&': {
        transition: 'background 375ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, box-shadow 280ms cubic-bezier(.4,0,.2,1) 0ms'
      }
    }
  });
  if (typeof _styles.root.fontSize === 'number') {
    _styles.root.fontSize = theme.pxToRem(_styles.root.fontSize) as any;
  }
  if (typeof _styles.root.letterSpacing === 'number') {
    _styles.root.letterSpacing = theme.pxToRem(_styles.root.letterSpacing) as any;
  }
  return _styles;
};
