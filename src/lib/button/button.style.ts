export const styles = theme => {
  const { button, fontFamily } = theme.typography;
  const _styles = ({
    root: {
      fontFamily,
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
      transition: 'all 375ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      overflow: 'hidden',
      ...button
    },
    outlined: {
      border: '1px solid currentColor'
    },
    content: {
      padding: 0,
      display: 'flex',
      justifyContent: 'inherit',
      alignItems: 'inherit',
      alignContent: 'inherit',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
    }
  });
  if (typeof _styles.root.fontSize === 'number') {
    _styles.root.fontSize = theme.pxToRem(_styles.root.fontSize);
  }
  if (typeof _styles.root.letterSpacing === 'number') {
    _styles.root.letterSpacing = theme.pxToRem(_styles.root.letterSpacing);
  }
  return _styles;
};
