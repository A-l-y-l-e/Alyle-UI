import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'example-02',
  templateUrl: './example-02.component.html',
  styleUrls: ['./example-02.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Example02Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
