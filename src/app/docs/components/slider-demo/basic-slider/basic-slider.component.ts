import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLES = ({
  slider: {
    display: 'block',
    padding: '16px'
  }
});

@Component({
  selector: 'aui-basic-slider',
  templateUrl: './basic-slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class BasicSliderComponent {
  readonly classes = this.theme.addStyleSheet(STYLES);

  constructor(private theme: LyTheme2) { }

}
