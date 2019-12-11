import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StyleRenderer, lyl } from '@alyle/ui';

const STYLES = () => ({
  styleBorder: lyl `{
    height: 120px
    width: 120px
    background: #ffe259
    background-image: linear-gradient(${
      [
        '45deg',
        '#ffe259 0%',
        '#ffa751 100%'
      ].join()
    })
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%
  }`
});

@Component({
  selector: 'aui-ds-css-declarations-block',
  templateUrl: './ds-css-declarations-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsCssDeclarationsBlockComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES);

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

}
