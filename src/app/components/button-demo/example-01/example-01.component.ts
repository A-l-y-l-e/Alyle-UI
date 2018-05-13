import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'example-01',
  templateUrl: './example-01.component.html',
  styleUrls: ['./example-01.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Example01Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
