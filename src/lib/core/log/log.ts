import { Injectable } from '@angular/core';
import { RandomId } from '../ly/random-id';

@Injectable()
export class Log {
  public _logs: any[] = [];
  constructor(private randomId: RandomId) {}
  public setLog(_name: any, val: any = undefined): any {
    let key: any = this.randomId.generate;
    this._logs.push({
      key$: key,
      name: _name,
      log: val,
    });
    console.warn(`LOG_>`, {
      key$: key,
      name: _name,
      log: val,
    });
  }
  public get logs() {
    return this._logs;
  }
}
