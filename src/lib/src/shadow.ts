import { Color } from '@alyle/ui/color';

const shadowKeyUmbraOpacity = 0.2;
const shadowKeyPenumbraOpacity = 0.14;
const shadowAmbientShadowOpacity = 0.12;
export const Shadows = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 3, 0, 0, 1, 1, 0, 0, 2, 1, -1],
  [0, 1, 5, 0, 0, 2, 2, 0, 0, 3, 1, -2],
  [0, 1, 8, 0, 0, 3, 4, 0, 0, 3, 3, -2],
  [0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0],
  [0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0],
  [0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0],
  [0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1],
  [0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2],
  [0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2],
  [0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3],
  [0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3],
  [0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4],
  [0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4],
  [0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4],
  [0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5],
  [0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5],
  [0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5],
  [0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6],
  [0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6],
  [0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7],
  [0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7],
  [0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7],
  [0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8],
  [0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8]
];

export function shadowBuilder(elevation: number | string, color?: Color) {
  let _color = color || new Color(0, 0, 0);
  const rgb = _color.rgb;

  if (!(rgb[0] === rgb[1] && rgb[0] === rgb[2])) {
    // Darken and saturate if the color is not in the grayscale
    _color = _color.darken().saturate(2);
  }

  const colors = [
    _color.alpha(shadowKeyUmbraOpacity).css(),
    _color.alpha(shadowKeyPenumbraOpacity).css(),
    _color.alpha(shadowAmbientShadowOpacity).css()
  ];

  const e = Shadows[elevation];
  // tslint:disable-next-line:max-line-length
  return `${e[0]}px ${e[1]}px ${e[2]}px ${e[3]}px ${colors[0]},${e[4]}px ${e[5]}px ${e[6]}px ${e[7]}px ${colors[1]},${e[8]}px ${e[9]}px ${e[10]}px ${e[11]}px ${colors[2]}`;

}
