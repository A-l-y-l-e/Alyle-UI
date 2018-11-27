import { StyleContainer } from '../theme2.service';

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
