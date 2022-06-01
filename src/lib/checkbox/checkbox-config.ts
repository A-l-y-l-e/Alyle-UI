import { InjectionToken } from '@angular/core';

/** Default `ly-checkbox` options that can be overridden. */
export interface LyCheckboxDefaultOptions {
  /** Default theme color palette to be used for checkboxes. */
  color?: string;
}

/** Injection token to be used to override the default options for `ly-checkbox`. */
export const LY_CHECKBOX_DEFAULT_OPTIONS = new InjectionToken<LyCheckboxDefaultOptions>(
  'ly-checkbox-default-options',
  {
    providedIn: 'root',
    factory: LY_CHECKBOX_DEFAULT_OPTIONS_FACTORY,
  },
);

/** @docs-private */
export function LY_CHECKBOX_DEFAULT_OPTIONS_FACTORY(): LyCheckboxDefaultOptions {
  return {
    color: 'accent'
  };
}
