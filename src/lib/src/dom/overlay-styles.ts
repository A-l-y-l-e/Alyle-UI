import { ThemeVariables } from '../theme/theme-config';
import * as _chroma from 'chroma-js';

/** @docs-private */
const chroma = _chroma;

export const STYLES_BACKDROP_TRANSPARENT = ({
  pointerEvents: 'all',
  userSelect: 'none',
});

export const STYLES_BACKDROP_DEFAULT = (theme: ThemeVariables) => ({
  ...STYLES_BACKDROP_TRANSPARENT,
  backgroundColor: chroma(theme.background.default).alpha(.32).css()
});


