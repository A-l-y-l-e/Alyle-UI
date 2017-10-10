import{
  AnimationEntryMetadata,
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/core';
/**
 * This animation
 */
export const hoverDay: AnimationEntryMetadata = trigger('hoverDay', [
  state('hover', style({opacity: 1})),
  transition('void => *', [
    style({opacity: 0}),
    animate(`200ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)`)
  ])
]);
