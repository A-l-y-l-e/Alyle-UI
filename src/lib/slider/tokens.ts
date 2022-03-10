import { InjectionToken } from '@angular/core';

/**
 * Used to provide a tick to some of the parent components without causing a circular dependency.
 * @docs-private
 */
export const LY_TICK = new InjectionToken<any>('LY_SLIDER_TICK');

/**
 * Used to provide a slider to some of the sub-components without causing a circular dependency.
 * @docs-private
 */
export const LY_SLIDER = new InjectionToken<any>('LY_SLIDER');
