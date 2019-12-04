import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
import { Location } from '@angular/common';
import { Ads } from '@shared/ads';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TitleComponent implements OnInit {
  private _route: string;
  title: string;
  urls: string[];

  set route(val: string) {
    if (val !== this.route) {
      val = this._route = this._location.path();

      this._ads.update(val, this._theme);
      this._cd.markForCheck();
    }
  }
  get route() {
    return this._route;
  }
  constructor(
    private _location: Location,
    private _cd: ChangeDetectorRef,
    private _theme: LyTheme2,
    private _ads: Ads
  ) { }

  ngOnInit() {
  }

}

