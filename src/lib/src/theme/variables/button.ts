import { StyleContainer } from '../style';

export interface ButtonVariables {
  root?: StyleContainer;
  defaultConfig: {
    size: keyof ButtonVariables['size']
    appearance?: keyof ButtonVariables['appearance']
  };
  size: {
    small?: StyleContainer
    medium?: StyleContainer
    large?: StyleContainer
  };
  appearance: {
    icon?: StyleContainer
    fab?: StyleContainer
    miniFab?: StyleContainer
  };
}
