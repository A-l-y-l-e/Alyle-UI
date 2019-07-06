import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLES = ({
  sliderContainer: {
    minHeight: '48px'
  }
});

@Component({
  selector: 'aui-slider-playground',
  templateUrl: './slider-playground.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderPlaygroundComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);
  value = 0;
  min = 0;
  max = 100;
  step = 10;
  vertical = false;
  marks = true;
  thumbVisible: boolean | null = null;
  showTicks: boolean | number = false;
  ticksPerStep = true;
  tickInterval = 1;
  disabled = false;

  get ticks(): number | boolean {
    return this.showTicks
      ? (this.ticksPerStep
        ? this.ticksPerStep
        : this.tickInterval)
      : false;
  }

  constructor(private theme: LyTheme2) { }

  ngOnInit() {
  }

}
