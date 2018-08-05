import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'aui-basic-tabs',
  templateUrl: './basic-tabs.component.html',
  styleUrls: ['./basic-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicTabsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
