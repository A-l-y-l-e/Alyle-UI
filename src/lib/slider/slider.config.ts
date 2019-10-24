import { StyleContainer, LyComponentStyle } from '@alyle/ui';
import { Color } from '@alyle/ui/color';
import { LySlider } from './slider';

export interface SliderVariables {
  root?: StyleContainer;
  defaultConfig?: {
    appearance?: LySlider['appearance'];
  };
  appearance?: LyComponentStyle<LySliderStyleConfig, 'appearance' | 'color' | 'disabled'>;
}

interface LySliderStyleConfig extends Omit<LySlider, 'disabled' | 'color'> {
  /**
   * @param value Color
   */
  disabled: string;
  color: Color;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
