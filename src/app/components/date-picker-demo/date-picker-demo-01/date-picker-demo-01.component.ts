import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'date-picker-demo-01',
  templateUrl: './date-picker-demo-01.component.html',
  styleUrls: ['./date-picker-demo-01.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerDemo01Component implements OnInit {
  date_start = new Date();
  constructor() { }

  ngOnInit() {
  }

}
