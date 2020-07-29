import { MediaQueryArray } from '@alyle/ui';

/**
 * Configuration for opening a modal dialog with the LyDialog service.
 */
export class LyDialogConfig<DATA = unknown> {

  /** Data being injected into the child component. */
  data?: DATA | null;

  /**
   * Width of the dialog container.
   * Support beakpoints
   */
  width?: MediaQueryArray | number | string;

  /**
   * Height of the dialog container.
   * Support beakpoints
   */
  height?: MediaQueryArray | number | string;

  /**
   * Max-height of the dialog container. If a number is provided, pixel units are assumed.
   * Defaults to `['calc(100vw - 90px)']`
   * Support beakpoints
   */
  maxHeight?: MediaQueryArray | number | string | null = ['calc(100vh - 64px)'];

  /**
   * Max-width of the dialog container. If a number is provided, pixel units are assumed.
   * Defaults to `['calc(100vw - 90px)']`
   * Support beakpoints
   */
  maxWidth?: MediaQueryArray | number | string | null = ['calc(100vw - 64px)'];

  /**
   * Min-height of the dialog container. If a number is provided, pixel units are assumed.
   * Support beakpoints
   */
  minHeight?: MediaQueryArray | number | string;

  /**
   * Min-width of the dialog container. If a number is provided, pixel units are assumed.
   * Support beakpoints
   */
  minWidth?: MediaQueryArray | number | string;

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

  /**
   * Whether the user can click on the backdrop to close the dialog.
   */
  disableClose?: boolean;
}
