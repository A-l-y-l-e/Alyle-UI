import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'input-example-04',
  templateUrl: './input-example-04.component.html',
  styleUrls: ['./input-example-04.component.css']
})
export class InputExample04Component implements OnInit {
  message: string = 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  disabled: boolean;
  num: number;
  text: string;
  color: string;
  value: string;
  position: string;

  constructor() { }

  get styles() {
    return {
      'font-size': `${ this.num }px`,
    }
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
    this.changeColor();
  }

}
