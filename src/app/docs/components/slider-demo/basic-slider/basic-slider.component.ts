import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const STYLES = (_theme: ThemeVariables) => ({ });

@Component({
  selector: 'aui-basic-slider',
  templateUrl: './basic-slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicSliderComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);


  constructor(private theme: LyTheme2) { }

  ngOnInit() {
  }

  displayWithFn(value: number) {
    return `${value}%`;
  }

}
