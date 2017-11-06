import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'menu-demo-02',
  templateUrl: './menu-demo-02.component.html',
  styleUrls: ['./menu-demo-02.component.scss']
})
export class MenuDemo02Component implements OnInit {
  anchorOrigin = { horizontal: 'middle', vertical: 'center' };
  targetOrigin = { horizontal: 'middle', vertical: 'center' };

  constructor() { }

  ngOnInit() {
  }

}
