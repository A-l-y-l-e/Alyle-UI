import { StyleDeclarationsBlock, STYLES_BACKDROP_DARK } from '@alyle/ui';

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

  /**
   * CSS declarations block.
   * Styles for the backdrop. overrides the current style.
   * @TODO: Create docs and add link here.
   */
  backdropStyleBlock?: StyleDeclarationsBlock = STYLES_BACKDROP_DARK;

  /**
   * CSS declarations block.
   * Styles for the dialog container. Merges with the current style.
   * @TODO: Create docs and add link here.
   */
  containerStyleBlock?: StyleDeclarationsBlock;

  /**
   * CSS declarations block.
   * Styles for the `<ly-dialog>`. Merges with the current style.
   * @TODO: Create docs and add link here.
   */
  dialogStyleBlock?: StyleDeclarationsBlock;
}
