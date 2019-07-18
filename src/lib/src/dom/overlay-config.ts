export class LyOverlayConfig {
  /** Styles for overlay container */
  styles?: Object;
  classes?: string[];
  hasBackdrop?: boolean = true;
  backdropClass?: string;
  fnDestroy?: (...arg: any) => void;
  /** Function that will be called on scroll or resize event */
  onResizeScroll?: (() => void);
  /**
   * Whether the user can click on the backdrop to close the overlay.
   */
  disableClose?: boolean = false;
}
