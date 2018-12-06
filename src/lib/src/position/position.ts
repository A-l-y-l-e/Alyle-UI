import { ThemeVariables } from '../theme/theme-config';
import { DirPosition } from '../style-utils';

export enum YPosition {
  above = 'above',
  below = 'below'
}

export enum XPosition {
  before = 'before',
  after = 'after',
  left = 'left',
  right = 'right'
}

export type Placement = XPosition | YPosition;

export function getPosition(
  placement: Placement,
  xPosition: XPosition,
  yPosition: YPosition,
  origin: Element,
  overlayElement: Element,
  themeVariables: ThemeVariables,
  offset = 0) {

  const originRect = origin.getBoundingClientRect() as DOMRect;
  const overlayElementRect = overlayElement.getBoundingClientRect() as DOMRect;
  if (xPosition && yPosition) {
    throw new Error(`You can not use \`xPosition\` and \`yPosition\` together, use only one of them.`);
  }
  if ((xPosition || yPosition) && !placement) {
    throw new Error(`\`placement\` is required.`);
  }
  let x = 0,
      y = 0,
      ox = 'center',
      oy = 'center';
  if (placement || xPosition || yPosition) {
    if (placement) {
      if (placement === YPosition.above) {
        x = (originRect.width - overlayElementRect.width) / 2;
        y = -overlayElementRect.height - offset;
        oy = 'bottom';
      } else if (placement === YPosition.below) {
        x = (originRect.width - overlayElementRect.width) / 2;
        y = originRect.height + offset;
        oy = 'top';
      } else {
        const dir = themeVariables.getDirection(placement as any);
        if (dir === DirPosition.left) {
          ox = '100%';
          x = -overlayElementRect.width - offset;
          y = (originRect.height - overlayElementRect.height) / 2;
        } else if (dir === DirPosition.right) {
          ox = '0%';
          x = originRect.width + offset;
          y = (originRect.height - overlayElementRect.height) / 2;
        }
      }
    }

    if (xPosition) {
      const dir = themeVariables.getDirection(xPosition as any);
      if (dir === DirPosition.right) {
        ox = '0%';
        x = 0;
      } else if (dir === DirPosition.left) {
        ox = '100%';
        x = originRect.width - overlayElementRect.width;
      }
    } else if (yPosition) {
      if (yPosition === YPosition.above) {
        y = 0;
        oy = '0%';
      } else if (yPosition === YPosition.below) {
        y = originRect.height - overlayElementRect.height;
        oy = '100%';
      }
    }
  }
  return {
    x: Math.round(x),
    y: Math.round(y),
    ox,
    oy
  };
}
