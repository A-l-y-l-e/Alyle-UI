export interface TypographyConfig {
  fontSize: number;
  fontFamily?: string;
  fontWeight?: number;
  letterSpacing?: number;
  textTransform?: 'uppercase' | 'capitalize' | 'lowercase';
  gutterTop?: number;
  gutterBottom?: number;
}

export class LyStyleUtils {
  typography: {
    htmlFontSize: number,
    fontSize: number;
  };
  pxToRem(value: number) {
    const size = this.typography.fontSize / 14;
    return `${value / this.typography.htmlFontSize * size}rem`;
  }
}
