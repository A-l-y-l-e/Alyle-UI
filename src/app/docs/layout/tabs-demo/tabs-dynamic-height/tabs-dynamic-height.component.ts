import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StyleRenderer } from '@alyle/ui';

@Component({
  selector: 'aui-tabs-dynamic-height',
  templateUrl: './tabs-dynamic-height.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ StyleRenderer ]
})
export class TabsDynamicHeightComponent { }
