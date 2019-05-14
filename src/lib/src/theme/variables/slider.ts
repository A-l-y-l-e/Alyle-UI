import { StyleContainer } from '../style';

export interface SliderVariables {
  root?: StyleContainer;
  defaultConfig?: {
    appearance?: keyof SliderVariablesAppearance
  };
  appearance?: SliderVariablesAppearance;
}

export interface SliderVariablesAppearance {
  icon?: StyleContainer;
  fab?: StyleContainer;
  miniFab?: StyleContainer;
}
