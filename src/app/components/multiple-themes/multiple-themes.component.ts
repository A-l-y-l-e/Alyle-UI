import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-multiple-themes',
  templateUrl: './multiple-themes.component.html',
  styleUrls: ['./multiple-themes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleThemesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
