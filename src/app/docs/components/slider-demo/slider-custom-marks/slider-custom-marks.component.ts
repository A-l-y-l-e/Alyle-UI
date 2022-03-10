import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'aui-slider-custom-marks',
  templateUrl: './slider-custom-marks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderCustomMarksComponent implements OnInit {
  readonly value = new FormControl(5);
  constructor() { }

  ngOnInit(): void {
  }

}
