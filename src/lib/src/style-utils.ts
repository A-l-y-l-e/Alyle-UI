export class LyStyleUtils {
  typography: {
    htmlFontSize: number,
    fontSize: number,
  };
  pxToRem(value: number) {
    const size = this.typography.fontSize / 14;
    return `${value / this.typography.htmlFontSize * size}rem`;
  }
}
