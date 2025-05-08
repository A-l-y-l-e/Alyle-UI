import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'aui-open-on-hover-menu',
  templateUrl: './open-on-hover-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class OpenOnHoverMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
