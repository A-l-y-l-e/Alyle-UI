import { StyleContainer } from '../style';

export interface FieldVariables {
  root?: StyleContainer;
  borderColor: string;
  labelColor: string;
  defaultConfig: {
    appearance?: keyof FieldVariables['appearance']
  };
  appearance: {
    outlined?: StyleContainer
    filled?: StyleContainer
  };
}
