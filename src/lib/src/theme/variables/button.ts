import { StyleContainer } from '../style';

export interface ButtonVariables {
  root?: StyleContainer;
  size?: {
    small?: StyleContainer
    medium?: StyleContainer
    large?: StyleContainer
  };
  appearance?: {
    icon?: StyleContainer
    fab?: StyleContainer
    miniFab?: StyleContainer
  };
}
