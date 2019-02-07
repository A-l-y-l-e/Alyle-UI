import { Injector, Type, InjectionToken, InjectFlags } from '@angular/core';

export class DynamicInjector implements Injector {

  constructor(private _newInjector: Injector, private _parentInjector: Injector) { }

  get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): T;
  get(token: any, notFoundValue?: any);
  get(token: any, notFoundValue?: any, _flags?: any) {
    const value = this._newInjector.get(token, notFoundValue);

    if (value) {
      return value;
    }

    return this._parentInjector.get<any>(token, notFoundValue);
  }
}
