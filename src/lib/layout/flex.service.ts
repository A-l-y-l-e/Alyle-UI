import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LyFlexService {
  private fxStyle = `box-sizing:border-box;display:flex;`;
  // classes = {
  //   direction: {
  //     row: this.theme.createStyle(
  //       'fxRow',
  //       () => (
  //         this.fxStyle +
  //         `flex-direction:row;`
  //       )
  //     ).id,
  //   },
  //   fxStart: this.theme.createStyle(
  //     'fxStart',
  //     () => (
  //       this.fxStyle +
  //       `justify-content:flex-start;`
  //     )
  //   ).id,
  //   fxCenter: this.theme.createStyle(
  //     'fxCenter',
  //     () => (
  //       this.fxStyle +
  //       `justify-content:flex-center;`
  //     )
  //   ).id
  // };
  constructor() { }
}
