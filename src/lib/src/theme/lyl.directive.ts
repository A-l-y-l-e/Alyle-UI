import { Directive, Input, SimpleChanges } from '@angular/core';
import { StyleRenderer, lyl, LyHostClass, eachMedia, StyleCollection } from '@alyle/ui';

@Directive({
  selector: 'lyl, [p], [pf], [pe], [pt], [pb]',
  providers: [
    LyHostClass,
    StyleRenderer,
  ]
})
export class Lyl {
  /** @docs-private */
  static readonly и = 'lyl';

  @Input() p: number;
  @Input() pf: number;
  @Input() pe: number;
  @Input() pt: number;
  @Input() pb: number;

  constructor(
    private _sr: StyleRenderer,
    private _hClass: LyHostClass
  ) { }

  ngOnChanges({p, pf, pe, pt, pb}: SimpleChanges) {
    if (p) {
      const { currentValue } = p;
      if (currentValue != null) {
        this[0x1] = this._sr.add(
          `${Lyl.и}--p-${currentValue}`,
          () => {
            const mediaQueries = new StyleCollection();
            eachMedia(currentValue, (val, media) => mediaQueries.add(
              lyl `{
                @media ${media || 'all'} {
                  padding: ${typeof val === 'number'
                    ? val * 8 + 'px'
                    : val}
                }
              }`
            ));
            return lyl `{
              ...${mediaQueries}
            }`;
          },
          this[0x1]
        );
      } else {
        this._hClass.remove(this[0x1]);
      }
    }

    if (pf) {
      const val = pf.currentValue;
      if (val != null) {
        this[0x2] = this._sr.add(
          `${Lyl.и}--pf-${val}`,
          ({after}) => lyl `{
            padding-${after}: ${val * 8}
          }`,
          this[0x2]
        );
      } else {
        this._hClass.remove(this[0x2]);
        this[0x2] = null;
      }
    }

    if (pe) {
      const val = pe.currentValue;
      if (val != null) {
        this[0x3] = this._sr.add(
          `${Lyl.и}--pe-${val}`,
          ({before}) => lyl `{
            padding-${before}: ${val * 8}
          }`,
          this[0x3]
        );
      } else {
        this._hClass.remove(this[0x3]);
        this[0x3] = null;
      }
    }

    if (pt) {
      const val = pf.currentValue;
      if (val != null) {
        this[0x4] = this._sr.add(
          `${Lyl.и}--pt-${val}`,
          () => lyl `{
            padding-top: ${val * 8}
          }`,
          this[0x4]
        );
      } else {
        this._hClass.remove(this[0x4]);
        this[0x4] = null;
      }
    }

    if (pb) {
      const val = pb.currentValue;
      if (val != null) {
        this[0x5] = this._sr.add(
          `${Lyl.и}--pb-${val}`,
          () => lyl `{
            padding-bottom: ${val * 8}
          }`,
          this[0x5]
        );
      } else {
        this._hClass.remove(this[0x5]);
        this[0x5] = null;
      }
    }
  }
}
