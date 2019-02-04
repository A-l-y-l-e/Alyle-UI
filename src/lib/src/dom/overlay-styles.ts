import { ThemeVariables } from '../theme/theme-config';
import * as _chroma from 'chroma-js';

/** @docs-private */
const chroma = _chroma;

export const STYLES_BACKDROP_TRANSPARENT = ({
  pointerEvents: 'all',
  userSelect: 'none',
});

export const STYLES_BACKDROP_WITH_BG = (theme: ThemeVariables) => ({
  ...STYLES_BACKDROP_TRANSPARENT,
  backgroundColor: chroma(theme.text.default).alpha(.32).css()
});


