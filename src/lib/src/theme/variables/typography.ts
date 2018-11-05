import { StyleContainer } from '../theme2.service';

export interface TypographyVariables {
  root?: StyleContainer;
  fontFamily: string;
  htmlFontSize: number;
  fontSize: number;
  gutterTop: number;
  gutterBottom: number;
  /**
   * `lyTyp`
   */
  lyTyp: {
    any?: TypographyTypeVariables
    [name: string]: TypographyTypeVariables
  };
}

export interface TypographyTypeVariables extends StyleContainer {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  letterSpacing?: number;
  textTransform?: string;
  gutterTop?: number;
  gutterBottom?: number;
}
