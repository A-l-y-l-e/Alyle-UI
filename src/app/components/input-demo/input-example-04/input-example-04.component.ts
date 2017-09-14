import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'input-example-04',
  templateUrl: './input-example-04.component.html',
  styleUrls: ['./input-example-04.component.css']
})
export class InputExample04Component implements OnInit {
  example: string;

  constructor() { }

  onSubmit() {
    console.log('submited');
  }
  
  ngOnInit() {

  }

}
