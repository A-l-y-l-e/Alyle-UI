import { Component, OnInit } from '@angular/core';
import { LyPalette } from 'alyle-ui/core';

@Component({
  selector: 'app-theming',
  templateUrl: './theming.component.html',
  styleUrls: ['./theming.component.css']
})
export class ThemingComponent implements OnInit {

  constructor(
    public palette: LyPalette
  ) { }

  colors() {
    return LyPalette.colors;
  }

  ngOnInit() {
  }

}
