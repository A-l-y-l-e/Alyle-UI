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

const INITIAL_V = 'initial';

/**
 * @depracated Use `OverlayPosition` instead.
 */
export class Positioning {
  private _offsetCheck = 16;
  private readonly _originRect = this.origin.getBoundingClientRect() as DOMRect;
  private readonly _overlayElementRect = this.overlayElement.getBoundingClientRect() as DOMRect;
  x: number;
  y: number;
  ax: number;
  ay: number;
  /** Origin X */
  ox: string;
  /** Origin Y */
  oy: string;
  width: string = INITIAL_V;
  height: string = INITIAL_V;
  private _origin: boolean;
  get offsetX(): number {
    return typeof this._offset === 'number'
    ? this._offset
    : this._offset.x || 0;
  }
  get offsetY(): number {
    return typeof this._offset === 'number'
    ? this._offset
    : this._offset.y || 0;
  }
  constructor(
    private placement: Placement,
    private xPosition: XPosition,
    private yPosition: YPosition,
    private origin: Element,
    private overlayElement: Element,
    private _themeVariables: ThemeVariables,
    private _offset: number | {
      x?: number
      y?: number
    } = 0,
    _flip = true
  ) {

    const offsetCheckx2 = this._offsetCheck * 2;
    this.createPosition();

    if (_flip) {
      for (let index = 0; index < 2; index++) {
        if (this.checkAll(false, true)) {
          this.createPosition();
        }
      }
    }

    // when there is not enough space
    if (this.checkAll(true, false)) {
      let requireUpdateOrigin = false;
      const _max_width = this._overlayElementRect.width + offsetCheckx2 > window.innerWidth;
      const _max_height = this._overlayElementRect.height + offsetCheckx2 > window.innerHeight;
      if (_max_height) {
        this.y = this._offsetCheck;
        this.height = `${window.innerHeight - offsetCheckx2}px`;
        requireUpdateOrigin = true;
      } else if (this.checkBottom(false, false)) {
        this.y += this.checkBottom(true, false) as number;
        requireUpdateOrigin = true;
      } else if (this.checkTop(false, false)) {
        this.y -= this.checkTop(true, false) as number;
        requireUpdateOrigin = true;
      }

      if (_max_width) {
        this.x = this._offsetCheck;
        this.width = `${window.innerWidth - offsetCheckx2}px`;
        requireUpdateOrigin = true;
      } else if (this.checkRight(false, false)) {
        this.x += this.checkRight(true, false) as number;
        requireUpdateOrigin = true;
      } else if (this.checkLeft(false, false)) {
        this.x -= this.checkLeft(true, false) as number;
        requireUpdateOrigin = true;
      }

      if (requireUpdateOrigin) {
        this.updateOrigin();
      }
    }

    if (this._offset) {
      this.updateOrigin();
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
    // if ((this.xPosition || this.yPosition) && !this.placement) {
    //   throw new Error(`\`placement\` is required.`);
    // }
    let x = this._originRect.x,
        y = this._originRect.y,
        ox = 'center',
        oy = 'center';
    // if (this.placement) {
      if (this.placement === YPosition.above) {
        x += (this._originRect.width - this._overlayElementRect.width) / 2;
        y += -this._overlayElementRect.height;
        oy = 'bottom';

        // set offset
        y -= this.offsetY;
      } else if (this.placement === YPosition.below) {
        x += (this._originRect.width - this._overlayElementRect.width) / 2;
        y += this._originRect.height;
        oy = 'top';

        // set offset
        y += this.offsetY;
      } else {
        const dir = this._themeVariables.getDirection(this.placement as any);
        if (dir === DirPosition.left) {
          ox = '100%';
          x += -this._overlayElementRect.width;
          y += (this._originRect.height - this._overlayElementRect.height) / 2;

          // set offset
          x -= this.offsetX;
        } else if (dir === DirPosition.right) {
          ox = '0%';
          x += this._originRect.width;
          y += (this._originRect.height - this._overlayElementRect.height) / 2;

          // set offset
          x += this.offsetX;
        }
      }

      if (this.xPosition) {
        const dir = this._themeVariables.getDirection(this.xPosition as any);
        if (dir === DirPosition.right) {
          ox = '0%';
          x = this._originRect.x;

          // set offset
          x += this.offsetX;
        } else if (dir === DirPosition.left) {
          ox = '100%';
          x = this._originRect.x + this._originRect.width - this._overlayElementRect.width;

          // set offset
          x -= this.offsetX;
        }
      } else if (this.yPosition) {
        if (this.yPosition === YPosition.above) {
          y = this._originRect.y + this._originRect.height - this._overlayElementRect.height;
          oy = '100%';

          // set offset
          y += this.offsetY;
        } else if (this.yPosition === YPosition.below) {
          y = this._originRect.y;
          oy = '0%';

          // set offset
          y -= this.offsetY;
        }
      }
    // }
    this.x = x;
    this.y = y;
    this.ax = x;
    this.ay = y;
    this.ox = ox;
    this.oy = oy;
    return {
      x: Math.round(x),
      y: Math.round(y),
      ox,
      oy
    };
  }

  private checkLeft(returnVal: boolean, invertIfNeed: boolean): boolean | number {
    const rest = this.ax - this._offsetCheck;
    if (returnVal) {
      return rest;
    }
    if (rest < 0) {
      if (invertIfNeed) {
        if (this.placement !== YPosition.above && this.placement !== YPosition.below) {
          this.placement = invertPlacement(this.placement);
        }
        if (this.xPosition) {
          this.xPosition = invertPlacement(this.xPosition) as XPosition;
        }
      }
      return true;
    }
    return false;
  }
  private checkRight(returnVal: boolean, invertIfNeed: boolean): boolean | number {
    const rest = window.innerWidth - (this.ax + this._overlayElementRect.width + this._offsetCheck);
    if (returnVal) {
      return rest;
    }
    if (rest < 0) {
      if (invertIfNeed) {
        if (this.placement !== YPosition.above && this.placement !== YPosition.below) {
          this.placement = invertPlacement(this.placement);
        }
        if (this.xPosition) {
          this.xPosition = invertPlacement(this.xPosition) as XPosition;
        }
      }
      return true;
    }
    return false;
  }
  private checkTop(returnVal: boolean, invertIfNeed: boolean): boolean | number {
    const rest = this.ay - this._offsetCheck;
    if (returnVal) {
      return rest;
    }
    if (rest < 0) {
      if (invertIfNeed) {
        if (this.placement === YPosition.above || this.placement === YPosition.below) {
          this.placement = invertPlacement(this.placement);
        }
        if (this.yPosition) {
          this.yPosition = invertPlacement(this.yPosition) as YPosition;
        }
      }
      return true;
    }
    return false;
  }
  private checkBottom(returnVal: boolean, invertIfNeed: boolean): boolean | number {
    const rest = window.innerHeight - (this.ay + this._overlayElementRect.height + this._offsetCheck);
    if (returnVal) {
      return rest;
    }
    if (rest < 0) {
      if (invertIfNeed) {
        if (this.placement === YPosition.above || this.placement === YPosition.below) {
          this.placement = invertPlacement(this.placement);
        }
        if (this.yPosition) {
          this.yPosition = invertPlacement(this.yPosition) as YPosition;
        }
      }
      return true;
    }
    return false;
  }

  private checkAll(returnVal: boolean, invertIfNeed: boolean) {
    return this.checkLeft(returnVal, invertIfNeed) ||
    this.checkRight(returnVal, invertIfNeed) ||
    this.checkTop(returnVal, invertIfNeed) ||
    this.checkBottom(returnVal, invertIfNeed);
  }

  private updateOrigin() {
    // do not update if it is defined
    if (this._origin) {
      return;
    }

    this._origin = true;
    const oax = this._originRect.x + this._originRect.width / 2;
    const oay = this._originRect.y + this._originRect.height / 2;
    const vax = this.x + this._overlayElementRect.width / 2;
    const vay = this.y + this._overlayElementRect.height / 2;
    this.ox = `${oax - vax + this._overlayElementRect.width / 2}px`;
    this.oy = `${oay - vay + this._overlayElementRect.height / 2}px`;
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
