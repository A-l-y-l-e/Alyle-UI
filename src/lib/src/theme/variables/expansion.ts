import { StyleContainer } from '../theme2.service';

export interface ExpansionVariables {
  root: StyleContainer;
  defaultConfig?: {
    appearance: keyof ExpansionVariables['appearance']
  };
  appearance: {
    default: StyleContainer
    flat?: StyleContainer
  };
}
