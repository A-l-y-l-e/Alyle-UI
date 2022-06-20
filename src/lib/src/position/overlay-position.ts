import { XPosition, YPosition } from './position';
import { LyTheme2 } from '../theme/theme2.service';
import { ViewportRuler } from '@angular/cdk/scrolling';



export class LyOverlayPosition {
  private _triggerRect: ClientRect;
  private _overlayRect: ClientRect;
  private _xAnchor?: XPosition | number;
  private _yAnchor?: YPosition | number;
  private _xAxis: XPosition = XPosition.after;
  private _yAxis: YPosition = YPosition.below;
  private _flip: boolean = false;
  private _viewportOffset = 16;
  private _viewportHeight: number = 0;
  private _viewportWidth: number = 0;
  private _xOffset = 0;
  private _yOffset = 0;
  private _rawX: number;
  private _rawY: number;
  /** Transform element's bounding `ClientRect` before render. */
  private _transform?: (triggerRect: ClientRect, overlayRect: ClientRect) => void;

  private _anchorDir: 'left' | 'right';
  private _axisDir: 'left' | 'right';

  /** xAnchor position */
  private _xa: number;
  /** XAnchor position */
  private _ya: number;

  get x() {
    return this._x;
  }
  private _x: number;

  get y() {
    return this._y;
  }
  private _y: number;

  get xo() {
    return this._xo;
  }
  private _xo: number;

  get yo() {
    return this._yo;
  }
  private _yo: number;

  get width() {
    return this._width;
  }
  private _width: number | null;

  get height() {
    return this._height;
  }
  private _height: number | null;

  get triggerRect() {
    return this._triggerRect;
  }

  /** Returns x, but not rounded */
  get rawX() {
    return this._rawX;
  }

  /** Returns y, but not rounded */
  get rawY() {
    return this._rawY;
  }

  constructor(
    private _theme: LyTheme2,
    private _viewportRuler: ViewportRuler,
    private _trigger: Element,
    private _overlay: Element,
  ) { }

  build() {
    this._updateRects();
    this._setDefaultAnchor();
    this._updateDir();
    this._callTransformIfExists();
    this._calculateResponsive();
    this._calculateOrigin();
    this._round();
    return this;
  }

  private _updateRects() {
    this._triggerRect = getMutableClientRect(this._trigger);
    this._overlayRect = getMutableClientRect(this._overlay);
    const { width, height } = this._viewportRuler.getViewportSize();
    this._viewportWidth = width;
    this._viewportHeight = height;
  }

  private _setDefaultAnchor() {
    if (!this._xAnchor) {
      this._xAnchor = this._xAxis === XPosition.after ? XPosition.before : XPosition.after;
    }
    if (!this._yAnchor) {
      this._yAnchor = this._yAxis;
    }
  }

  private _callTransformIfExists() {
    if (this._transform) {
      this._transform(this._triggerRect, this._overlayRect);
    }
  }

  private _updateDir() {
    // If it is not number
    if (typeof this._xAnchor !== 'number') {
      this._anchorDir = this._theme.variables.getDirection(this._xAnchor as any) as 'left' | 'right';
    }
    this._axisDir = this._theme.variables.getDirection(this._xAxis as any) as 'left' | 'right';
  }

  private _calculateResponsive() {
    this._calculate();
    if (this._flip && typeof this._xAnchor === 'string' && typeof this._yAnchor === 'string') {
      if (this._isOverflowX() && (this._overlayRect.width < (this._xa - this._viewportOffset))) {
        this.setXAxis(flipPosition(this._xAxis))
            .setXAnchor(flipPosition(this._xAnchor));
        this._updateDir();
        this._calculate();
      }
      if (this._isOverflowY() && (this._overlayRect.height < (this._ya - this._viewportOffset))) {
        this.setYAxis(flipPosition(this._yAxis))
            .setYAnchor(flipPosition(this._yAnchor));
        this._calculate();
      }
    }

    if (this._isOverflowX()) {
      if (this._overlayRect.width > this._viewportWidth - (this._viewportOffset * 2)) {
        this._x = this._viewportOffset;
        this._width = this._viewportWidth - (this._viewportOffset * 2);
      } else if (this._isOverflowLeft()) {
        this._x = this._viewportOffset;
      } else if (this._isOverflowRight()) {
        this._x = this._viewportWidth - this._overlayRect.width - this._viewportOffset;
      }
    }
    if (this._isOverflowY()) {
      if (this._overlayRect.height > this._viewportHeight - (this._viewportOffset * 2)) {
        this._y = this._viewportOffset;
        this._height = this._viewportHeight - (this._viewportOffset * 2);
      } else if (this._isOverflowTop()) {
        this._y = this._viewportOffset;
      } else if (this._isOverflowBottom()) {
        this._y = this._viewportHeight - this._overlayRect.height - this._viewportOffset;
      }
    }
  }

  /**
   * Return true if the menu overflows vertically
   */
  private _isOverflowX() {
    return this._isOverflowLeft() // Left
    || this._isOverflowRight(); // Right
  }
  private _isOverflowLeft() {
    return this.x < this._viewportOffset;
  }
  private _isOverflowRight() {
    return (this.x + this._overlayRect.width) > (this._viewportWidth - this._viewportOffset);
  }

  /** Return true the menu overflows horizontally */
  private _isOverflowY() {
    return this._isOverflowTop() // Top
    || this._isOverflowBottom(); // Bottom
  }
  private _isOverflowTop() {
    return this.y < this._viewportOffset;
  }
  private _isOverflowBottom() {
    return (this.y + this._overlayRect.height) > (this._viewportHeight - this._viewportOffset);
  }

  private _calculate() {
    this._calculateAnchorPosition();
    this._calculateAxis();
  }

  private _calculateAnchorPosition() {
    this._xa = this._triggerRect[this._anchorDir];
    if (this._yAnchor === YPosition.above) {
      this._ya = this._triggerRect.top;
    } else {
      this._ya = this._triggerRect.bottom;
    }
    // apply offset with support for rtl
    if (this._anchorDir === 'left') {
      this._xa += this._xOffset;
    } else {
      this._xa -= this._xOffset;
    }
    this._ya += this._yOffset;
  }

  private _calculateAxis() {
    if (this._axisDir === 'left') {
      this._x = this._xa - this._overlayRect.width;
    } else {
      this._x = this._xa;
    }

    if (this._yAxis === YPosition.above) {
      this._y = this._ya - this._overlayRect.height;
    } else {
      this._y = this._ya;
    }
  }

  /** Calculate origin for overlay */
  private _calculateOrigin() {
    const xAnchorCenter = this._xa - this._xOffset;
    const yAnchorCenter = this._ya - this._yOffset;
    const xOverlayCenter = this.x + (this._overlayRect.width / 2);
    const yOverlayCenter = this.y + (this._overlayRect.height / 2);
    const xo = (xAnchorCenter - xOverlayCenter) + this._overlayRect.width / 2;
    const yo = (yAnchorCenter - yOverlayCenter) + this._overlayRect.height / 2;
    this._xo = xo;
    this._yo = yo;
  }

  private _round() {
    this._rawX = this.x;
    this._rawY = this.y;
    this._x = Math.round(this.x);
    this._y = Math.round(this.y);
  }

  // setTrigger(val: Element) {
  //   this._trigger = val;
  //   return this;
  // }
  // setOverlay(val: Element) {
  //   this._overlay = val;
  //   return this;
  // }
  setXAnchor(val: XPosition | number) {
    this._xAnchor = val;
    return this;
  }
  setYAnchor(val: YPosition | number) {
    this._yAnchor = val;
    return this;
  }
  setXAxis(val?: XPosition | null) {
    this._xAxis = val ?? XPosition.after;
    return this;
  }
  setYAxis(val?: YPosition | null) {
    this._yAxis = val ?? YPosition.below;
    return this;
  }

  setFlip(flip: boolean = true) {
    this._flip = flip;
    return this;
  }

  setXOffset(val: number) {
    this._xOffset = val;
    return this;
  }
  setYOffset(val: number) {
    this._yOffset = val;
    return this;
  }

  /**
   * Offset from the edge of the viewport to the center.
   * It is the minimum space that must be between the window and the overlay.
   */
  setViewportOffset(val: number) {
    this._viewportOffset = val;
    return this;
  }
  setTransform(transform: (triggerRect: ClientRect, overlayRect: ClientRect) => void) {
    this._transform = transform;
    return this;
  }
}


/** Gets a mutable version of an element's bounding `ClientRect`. */
function getMutableClientRect(element: Element): ClientRect {
  const clientRect = element.getBoundingClientRect();

  // We need to clone the `clientRect` here, because all the values on it are readonly
  // and we need to be able to update them. Also we can't use a spread here, because
  // the values on a `ClientRect` aren't own properties. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#Notes
  return {
    top: clientRect.top,
    right: clientRect.right,
    bottom: clientRect.bottom,
    left: clientRect.left,
    width: clientRect.width,
    height: clientRect.height
  } as ClientRect;
}

function flipPosition(position: XPosition): XPosition;
function flipPosition(position: YPosition): YPosition;
function flipPosition(position: XPosition | YPosition): XPosition | YPosition {
  switch (position) {
    case XPosition.after:
      return XPosition.before;
    case XPosition.before:
      return XPosition.after;
    case XPosition.left:
      return XPosition.right;
    case XPosition.right:
      return XPosition.left;
    case YPosition.above:
      return YPosition.below;
    case YPosition.below:
      return YPosition.above;
  }
}
