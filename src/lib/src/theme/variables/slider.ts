import { StyleContainer } from '../style';
import { ThemeVariables } from '../theme-config';

export interface SliderVariables {
  root?: StyleContainer;
  defaultConfig?: {
    appearance?: keyof SliderAppearance
  };
  color?: (theme: ThemeVariables, value: string) => StyleContainer;
  appearance?: SliderAppearance;
}

export interface SliderAppearance {
  standard?: {
    styles: StyleContainer
    color: (theme: ThemeVariables, value: string) => StyleContainer;
  };
}
