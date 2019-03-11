import { StyleContainer } from '../theme2.service';

export interface ExpansionVariables {
  root?: StyleContainer;
  defaultConfig?: {
    appearance: Exclude<keyof ExpansionVariables['appearance'], 'init'>
  };
  appearance: {
    init?: StyleContainer,
    default: StyleContainer
    flat?: StyleContainer
  };
}
