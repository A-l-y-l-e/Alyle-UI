import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'button-example-04',
  templateUrl: './button-example-04.component.html',
  styleUrls: ['./button-example-04.component.css']
})
export class ButtonExample04Component implements OnInit {
  color = '#841dab';
  raisedState: string;
  constructor() {
    this.changeColor();
  }

  /**
   * Change color
   */
  changeColor() {
    const dec = Math.floor(Math.random() * 1000);
    let result: any = (dec - Math.floor(dec / 358) * 358);
    result = `hsl(${result}, 76%, 59%)`;
    const color = result;
    this.color = result;
    console.log('%cCOLOR', `background:${color};color:#fff;`, (color));
  }

  ngOnInit() {
  }

}
