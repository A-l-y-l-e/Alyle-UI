import { StyleContainer } from '../style';

export interface ToolbarVariables {
  root?: StyleContainer;
  defaultConfig?: {
    appearance?: keyof ToolbarAppearance
  };
  appearance?: ToolbarAppearance;
}

export interface ToolbarAppearance {
  dense?: StyleContainer;
}
