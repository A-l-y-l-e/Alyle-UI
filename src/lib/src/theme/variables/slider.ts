import { StyleContainer } from '../style';

export interface SliderVariables {
  root?: StyleContainer;
  defaultConfig?: {
    appearance?: keyof SliderAppearance
  };
  appearance?: SliderAppearance;
}

export interface SliderAppearance {
  standard?: StyleContainer;
}
