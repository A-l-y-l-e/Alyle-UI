import { Constructor } from './constructor';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

export interface CanOutlined {
  outlined: boolean;
  /**
   * It is only used for common behavior, therefore, it should not be used for other purposes.
   */
  readonly _superHyperInternalPropertyOutlined: boolean;
}

export function mixinOutlined<T extends Constructor>(base: T): Constructor<CanOutlined> & T {
  return class extends base {
    _superHyperInternalPropertyOutlined: boolean;

    get outlined(): boolean { return this._superHyperInternalPropertyOutlined; }
    set outlined(value: BooleanInput) { this._superHyperInternalPropertyOutlined = coerceBooleanProperty(value); }

    constructor(...args: any[]) { super(...args); }
  };
}
