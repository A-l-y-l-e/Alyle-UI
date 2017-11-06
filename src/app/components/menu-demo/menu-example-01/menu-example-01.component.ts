import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'menu-example-01',
  templateUrl: './menu-example-01.component.html',
  styleUrls: ['./menu-example-01.component.css']
})
export class MenuExample01Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  al(b) {
    console.log(b);
  }

}
