import { Directive, Input } from '@angular/core';
import {
  LyTheme2,
  mixinBg,
  mixinColor,
  mixinElevation,
  mixinFlat,
  mixinOutlined,
  mixinRaised,
  mixinShadowColor,
  mixinStyleUpdater
  } from '@alyle/ui';

const STYLES = ({
  root: {
    display: 'inline-flex',
    position: 'relative',
    fontSize: '1.25em',
    flexShrink: 0,
    alignItems: 'center',
    userSelect: 'none',
    borderRadius: '50%',
    textAlign: 'center',
    justifyContent: 'center'
  }
});

/** @docs-private */
export class LyAvatarBase {
  constructor(
    public _theme: LyTheme2
  ) { }
}

/** @docs-private */
export const LyAvatarMixinBase = mixinStyleUpdater(
  mixinBg(
    mixinFlat(
      mixinColor(
        mixinRaised(
          mixinOutlined(
            mixinElevation(
              mixinShadowColor(LyAvatarBase))))))));

@Directive({
  selector: 'ly-avatar'
})
export class LyAvatar extends LyAvatarMixinBase {
  @Input() size: number;
  constructor(
    theme: LyTheme2
  ) { super(theme); }
}
