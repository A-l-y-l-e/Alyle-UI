import { InjectionToken } from '@angular/core';

/**
 * Used to provide a slider to some of the sub-components without causing a circular dependency.
 * @docs-private
 */
export const LY_SLIDER = new InjectionToken<any>('LY_SLIDER');
