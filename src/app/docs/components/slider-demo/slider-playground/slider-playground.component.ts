import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { lyl, StyleRenderer } from '@alyle/ui';

const STYLES = () => {
  return {
    sliderContainer: lyl `{
      margin: 16px
    }`
  };
};

@Component({
  selector: 'aui-slider-playground',
  templateUrl: './slider-playground.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ]
})
export class SliderPlaygroundComponent implements OnInit {
  readonly classes = this.sRenderer.renderSheet(STYLES);
  value = 70;
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
  size: 'small' | 'medium' = 'small';
  color: 'primary' | 'accent' = 'primary';
  appearance: 'standard' | 'md' = 'standard';

  get ticks(): number | boolean {
    return this.showTicks
      ? (this.ticksPerStep
        ? this.ticksPerStep
        : this.tickInterval)
      : false;
  }

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

  ngOnInit() {
  }

}
