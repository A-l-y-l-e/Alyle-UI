import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
  selector: 'radio-example-01',
  templateUrl: './radio-example-01.component.html',
  styleUrls: ['./radio-example-01.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class RadioExample01Component implements OnInit {
  val: string;
  constructor() { }

  ngOnInit() {
  }

}
