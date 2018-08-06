import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'aui-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  @Input() value: string;

  constructor() { }

  ngOnInit() {
  }

}
