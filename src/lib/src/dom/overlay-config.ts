export interface OverlayConfig {
  styles: Object;
  classes?: string[];
  backdrop?: boolean;
  fnDestroy?: (...arg: any) => void;
  /** Function that will be called on scroll or resize event */
  onResizeScroll?: (() => void);
  /** @deprecated */
  host?: any;
}
