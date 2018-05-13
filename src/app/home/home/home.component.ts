import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme } from '@alyle/ui';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  constructor(
    public theme: LyTheme
  ) { }

}
