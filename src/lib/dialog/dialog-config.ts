/**
 * Configuration for opening a modal dialog with the LyDialog service.
 */
export class LyDialogConfig<DATA = unknown> {

  /** Data being injected into the child component. */
  data?: DATA | null;

  /** Width of the dialog. */
  width?: number | string;

  /** Height of the dialog. */
  height?: number | string;

  /**
   * Max-height of the dialog. If a number is provided, pixel units are assumed.
   * Defaults to calc(100vw - 90px)
   */
  maxHeight?: number | string | null = 'calc(100vh - 64px)';

  /**
   * Max-width of the dialog. If a number is provided, pixel units are assumed.
   * Defaults to calc(100vw - 90px)
   */
  maxWidth?: number | string | null = 'calc(100vw - 64px)';

  /** Min-height of the dialog. If a number is provided, pixel units are assumed. */
  minHeight?: number | string;

  /** Min-width of the dialog. If a number is provided, pixel units are assumed. */
  minWidth?: number | string;

  /** Whether the dialog has a backdrop. */
  hasBackdrop?: boolean = true;

  /**
   * Custom class for the backdrop. Overrides the current style.
   */
  backdropClass?: string;

  /**
   * Custom class for the `<ly-dialog-container>`. Overwrite the current style.
   */
  containerClass?: string;
}
