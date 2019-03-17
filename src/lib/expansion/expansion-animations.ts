import { trigger, state, style, transition, animate } from '@angular/animations';

export const lyExpansionAnimations = {
  contentExpansion: trigger('contentExpansion', [
    state('collapsed, void', style({height: '0px', visibility: 'hidden'})),
    state('expanded', style({height: '*', visibility: 'visible'})),
    transition('expanded <=> collapsed, void => collapsed',
      animate('{{panelAnimationTiming}}')),
  ])
};
