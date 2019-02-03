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

  /** Min-height of the dialog. If a number is provided, pixel units are assumed. */
  maxHeight?: number | string;

  /** Max-width of the dialog. If a number is provided, pixel units are assumed. Defaults to 80vw */
  maxWidth?: number | string = '80vw';

  /** Min-height of the dialog. If a number is provided, pixel units are assumed. */
  minHeight?: number | string;

  /** Min-width of the dialog. If a number is provided, pixel units are assumed. */
  minWidth?: number | string;

  /** Whether the dialog has a backdrop. */
  hasBackdrop?: boolean = true;
}
