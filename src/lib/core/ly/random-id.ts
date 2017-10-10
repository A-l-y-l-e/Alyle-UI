import { Injectable } from '@angular/core';


@Injectable()
export class RandomId {
  public get generate() {
    let id: any = (Math.random() + Date.now());
    return id;
  }
}
