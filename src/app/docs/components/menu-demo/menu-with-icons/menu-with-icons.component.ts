import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StyleRenderer, lyl } from '@alyle/ui';

export const STYLES = () => ({
  spacer: lyl `{
    flex: 1 1 auto
  }`
});


@Component({
  selector: 'aui-menu-with-icons',
  templateUrl: './menu-with-icons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ]
})
export class MenuWithIconsComponent {

  readonly classes = this.sRenderer.renderSheet(STYLES);
  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

}
