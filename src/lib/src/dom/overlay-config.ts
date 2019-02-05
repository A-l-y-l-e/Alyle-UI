import { STYLES_BACKDROP_TRANSPARENT } from './overlay-styles';
import { StyleDeclarationsBlock } from '../theme/theme2.service';

export class LyOverlayConfig {
  /** Styles for overlay container */
  styles?: Object;
  classes?: string[];
  hasBackdrop?: boolean = true;
  backdropStyleBlock?: StyleDeclarationsBlock = STYLES_BACKDROP_TRANSPARENT;
  fnDestroy?: (...arg: any) => void;
  /** Function that will be called on scroll or resize event */
  onResizeScroll?: (() => void);
}