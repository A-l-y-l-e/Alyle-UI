import { StyleContainer, LyComponentStyle } from '@alyle/ui';
import { LySlider } from './slider';

export interface SliderVariables {
  root?: StyleContainer;
  defaultConfig?: {
    appearance?: LySlider['appearance'];
  };
  appearance?: LyComponentStyle<LySlider, 'appearance' | 'color'>;
}
