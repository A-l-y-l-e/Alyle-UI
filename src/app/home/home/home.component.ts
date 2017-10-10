import { Component, OnInit } from '@angular/core';
import { LyTheme } from 'alyle-ui/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public theme: LyTheme
  ) { }

  ngOnInit() {
  }

}
