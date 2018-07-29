export type StyleContent<T> = (theme?: T) => string;

export interface StyleData {
  /** Class Id */
  id: string;
  key: string;
  styleContainer: any;
  styleContent: any;
  fn: () => string;
}
export interface DataStyle {
  id: string;
  styleElement: HTMLStyleElement;
  style: Style<any>;
}

export interface MultipleStyles<T> {
  [key: string]: StyleContent<T>;
}

export type Style<T> = string | StyleContent<T> | MultipleStyles<T>;
