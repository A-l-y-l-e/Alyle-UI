import { shadowBuilder } from '../shadow';

const DEFAULT_VALUE = '';
export function buildCommonBehaviors(
  bg: string,
  color: string,
  raised: string,
  elevation: string,
  disabled: boolean,
  outlined: boolean,
  shadowColor: string,
  autoContrast: boolean,
  STYLE_PRIORITY: number
) {
  const __bg = bg;
  const __color = color;
  const __raised = raised;
  const __elevation = elevation;
  const __disabled = disabled;
  const __outlined = outlined;
  const __shadowColor = shadowColor;
  const __isContrast = autoContrast && !__color || __color === 'auto';
  const newKey = `common----:${
    __bg || DEFAULT_VALUE}·${
      __color || DEFAULT_VALUE}·${
        __raised || DEFAULT_VALUE}·${
          __elevation || DEFAULT_VALUE}·${
            __disabled || DEFAULT_VALUE}·${
              __outlined || DEFAULT_VALUE}·${
                __shadowColor || DEFAULT_VALUE}·${
                  __isContrast || DEFAULT_VALUE}`;
  this._className = this.theme.addStyle(newKey, (theme) => {
    const style: {
      border?: string,
      background?: string,
      color?: string,
      boxShadow?: string,
      pointerEvents?: 'none';
      '&:hover'?: {
        boxShadow?: string
      },
      '&:active'?: {
        boxShadow?: string
      }
    } = {};
    if (__outlined) {
      style.border = '1px solid currentColor';
    }
    if (__disabled) {
      style.color = theme.text.disabled;
      style.pointerEvents = 'none';
      if (__bg) {
        style.background = theme.button.disabled;
      }
    } else {
      if (__bg) {
        style.background = theme.colorOf(__bg);
        if (__isContrast) {
          style.color = theme.colorOf(`${__bg}:contrast`);
        }
      }
      if (!style.color && __color) {
        style.color = theme.colorOf(__color);
      }
      if (__raised || __elevation) {
        if (!__bg) {
          style.background = theme.background.primary.default;
        }
        const backgroundColorCss = style.background !== __bg && theme.colorOf(__bg || 'background:primary', 'shadow');
        const shadowColorx = (__shadowColor && theme.colorOf(__shadowColor)) || backgroundColorCss || style.background || style.color || theme.shadow;
        style.boxShadow = shadowBuilder(__elevation || 3, shadowColorx);
        if (!__elevation) {
          style['&:active'] = {
            boxShadow: shadowBuilder(8, shadowColorx)
          };
        }
      }
    }
    return style as any;
  }, this._getHostElement(), this._className, STYLE_PRIORITY);
}
