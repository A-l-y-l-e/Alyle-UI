import { Constructor } from './constructor';
import { CanDisable } from './disabled';

const DEFAULT_TAB_INDEX = 0;

/** @docs-private */
export interface HasTabIndex {
  tabIndex: number;
}

/** @docs-private */
export type HasTabIndexCtor = Constructor<HasTabIndex>;

export function mixinTabIndex<T extends Constructor<CanDisable>>(base: T): Constructor<HasTabIndex> & T {
  return class extends base {
    private _tabIndex: number = DEFAULT_TAB_INDEX;

    get tabIndex(): number {
      return this.disabled ? -1 : this._tabIndex;
    }
    set tabIndex(value: number) {
      this._tabIndex = value != null ? value : DEFAULT_TAB_INDEX;
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
