import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'aui-basic-field',
  templateUrl: './basic-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicFieldComponent implements OnInit {
  val = 'valtesdfzz';
  constructor() { }

  ngOnInit() {
  }

}
