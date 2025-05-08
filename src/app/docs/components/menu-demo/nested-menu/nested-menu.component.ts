import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'aui-nested-menu',
  templateUrl: './nested-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class NestedMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
