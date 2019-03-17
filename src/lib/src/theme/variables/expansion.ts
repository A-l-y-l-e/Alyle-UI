import { StyleContainer } from '../style';

export interface ExpansionVariables {
  root: StyleContainer;
  defaultConfig?: {
    appearance: keyof ExpansionVariables['appearance']
  };
  appearance: {
    popOut: StyleContainer
  };
}
