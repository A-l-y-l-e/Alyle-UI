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

/** @deprecated in favor of `Positioning` */
export function getPosition(
  placement: Placement,
  xPosition: XPosition,
  yPosition: YPosition,
  origin: Element,
  overlayElement: Element,
  themeVariables: ThemeVariables,
  offset = 0
) {
  return createPosition(
    placement,
    xPosition,
    yPosition,
    origin,
    overlayElement,
    themeVariables,
    offset
  );
}

function createPosition(
  placement: Placement,
  xPosition: XPosition,
  yPosition: YPosition,
  origin: Element,
  overlayElement: Element,
  themeVariables: ThemeVariables,
  offset = 0
) {

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

export class Positioning {
  private offsetCheck = 16;
  private originRect = this.origin.getBoundingClientRect() as DOMRect;
  private overlayElementRect = this.overlayElement.getBoundingClientRect() as DOMRect;
  x: number;
  y: number;
  ax: number;
  ay: number;
  ox: string;
  oy: string;
  width: number;
  height: number;
  constructor(
    private placement: Placement,
    private xPosition: XPosition,
    private yPosition: YPosition,
    private origin: Element,
    private overlayElement: Element,
    private themeVariables: ThemeVariables,
    private offset = 0
  ) {
    this.createPosition();

    for (let index = 0; index < 2; index++) {
      if (this.checkAll()) {
        this.createPosition();
      }
    }

    // Where there is not enough space
    if (this.checkAll()) {
      const _max_width = this.overlayElementRect.width + this.offsetCheck * 2 > window.innerWidth;
      const _max_height = this.overlayElementRect.height + this.offsetCheck * 2 > window.innerHeight;
      if (_max_width || _max_height) {
        if (_max_height) {
          this.y = this.originRect.y - this.offsetCheck;
          this.y *= -1;
        }
        if (_max_width) {
          this.x = this.originRect.x - this.offsetCheck;
          this.x *= -1;
        }
      } else if (this.checkBottom()) {
        this.y += this.checkBottom(true) as number;
      } else if (this.checkTop()) {
        this.y -= this.checkTop(true) as number;
      }
      if (this.checkRight()) {
        this.x += this.checkRight(true) as number;
      } else if (this.checkLeft()) {
        this.x -= this.checkLeft(true) as number;
      }
    }

    // round result
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.ax = Math.round(this.ax);
    this.ay = Math.round(this.ay);

  }

  private createPosition(
  ) {
    if (this.xPosition && this.yPosition) {
      throw new Error(`You can not use \`xPosition\` and \`yPosition\` together, use only one of them.`);
    }
    if ((this.xPosition || this.yPosition) && !this.placement) {
      throw new Error(`\`placement\` is required.`);
    }
    let x = 0,
        y = 0,
        ox = 'center',
        oy = 'center';
    if (this.placement || this.xPosition || this.yPosition) {
      if (this.placement) {
        if (this.placement === YPosition.above) {
          x = (this.originRect.width - this.overlayElementRect.width) / 2;
          y = -this.overlayElementRect.height - this.offset;
          oy = 'bottom';
        } else if (this.placement === YPosition.below) {
          x = (this.originRect.width - this.overlayElementRect.width) / 2;
          y = this.originRect.height + this.offset;
          oy = 'top';
        } else {
          const dir = this.themeVariables.getDirection(this.placement as any);
          if (dir === DirPosition.left) {
            ox = '100%';
            x = -this.overlayElementRect.width - this.offset;
            y = (this.originRect.height - this.overlayElementRect.height) / 2;
          } else if (dir === DirPosition.right) {
            ox = '0%';
            x = this.originRect.width + this.offset;
            y = (this.originRect.height - this.overlayElementRect.height) / 2;
          }
        }
      }

      if (this.xPosition) {
        const dir = this.themeVariables.getDirection(this.xPosition as any);
        if (dir === DirPosition.right) {
          ox = '0%';
          x = 0;
        } else if (dir === DirPosition.left) {
          ox = '100%';
          x = this.originRect.width - this.overlayElementRect.width;
        }
      } else if (this.yPosition) {
        if (this.yPosition === YPosition.above) {
          y = 0;
          oy = '0%';
        } else if (this.yPosition === YPosition.below) {
          y = this.originRect.height - this.overlayElementRect.height;
          oy = '100%';
        }
      }
    }
    this.x = x;
    this.y = y;
    this.ax = x + this.overlayElementRect.x;
    this.ay = y + this.overlayElementRect.y;
    this.ox = ox;
    this.oy = oy;
    return {
      x: Math.round(x),
      y: Math.round(y),
      ox,
      oy
    };
  }

  private checkLeft(returnVal?: boolean): boolean | number {
    const rest = this.ax - this.offsetCheck;
    if (returnVal) {
      return rest;
    }
    if (rest < 0) {
      if (this.placement !== YPosition.above && this.placement !== YPosition.below) {
        this.placement = invertPlacement(this.placement);
      }
      if (this.xPosition) {
        this.xPosition = invertPlacement(this.xPosition) as XPosition;
      }
      return true;
    }
    return false;
  }
  private checkRight(returnVal?: boolean): boolean | number {
    const rest = window.innerWidth - (this.ax + this.overlayElementRect.width + this.offsetCheck);
    if (returnVal) {
      return rest;
    }
    if (rest < 0) {
      if (this.placement !== YPosition.above && this.placement !== YPosition.below) {
        this.placement = invertPlacement(this.placement);
      }
      if (this.xPosition) {
        this.xPosition = invertPlacement(this.xPosition) as XPosition;
      }
      return true;
    }
    return false;
  }
  private checkTop(returnVal?: boolean): boolean | number {
    const rest = this.ay - this.offsetCheck;
    if (returnVal) {
      return rest;
    }
    if (rest < 0) {
      if (this.placement === YPosition.above || this.placement === YPosition.below) {
        this.placement = invertPlacement(this.placement);
      }
      if (this.yPosition) {
        this.yPosition = invertPlacement(this.yPosition) as YPosition;
      }
      return true;
    }
    return false;
  }
  private checkBottom(returnVal?: boolean): boolean | number {
    const rest = window.innerHeight - (this.ay + this.overlayElementRect.height + this.offsetCheck);
    if (returnVal) {
      return rest;
    }
    if (rest < 0) {
      if (this.placement === YPosition.above || this.placement === YPosition.below) {
        this.placement = invertPlacement(this.placement);
      }
      if (this.yPosition) {
        this.yPosition = invertPlacement(this.yPosition) as YPosition;
      }
      return true;
    }
    return false;
  }

  private checkAll() {
    return this.checkLeft() ||
    this.checkRight() ||
    this.checkTop() ||
    this.checkBottom();
  }

}
export function invertPlacement(placement: Placement): Placement {
  if (placement === YPosition.above) {
    return YPosition.below;
  } else if (placement === YPosition.below) {
    return YPosition.above;
  } else if (placement === XPosition.after) {
    return XPosition.before;
  } else if (placement === XPosition.before) {
    return XPosition.after;
  } else if (placement === XPosition.right) {
    return XPosition.left;
  } else if (placement === XPosition.left) {
    return XPosition.right;
  }
  return placement;
}
