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
