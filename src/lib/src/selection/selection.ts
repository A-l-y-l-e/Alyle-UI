export interface SelectionOpts<T = any> {
  multiple?: true;
  /**
   * Initially selected values
   * Note: if `multiple` === `true` then `selecteds` should be of type `T[]`
   * else it should be of type `T`
   */
  selecteds?: T | T[];
  getKey?: (o: T) => unknown;
}

function same(o: any): unknown {
  return o;
}

export class LySelectionModel<T = any> {
  readonly _selectionMap = new Map<unknown, T>();
  private _multiple?: true;
  private _getKeyFn: (o: T) => unknown = same;

  /** Cache for the array value of the selected items. */
  private _selected: T[] | null;

  /** Selected values. */
  get selected(): T[] {
    if (!this._selected) {
      this._selected = Array.from(this._selectionMap.values());
    }

    return this._selected;
  }

  constructor(opts?: SelectionOpts<T>) {
    if (!opts) {
      return;
    }
    const { multiple, getKey } = opts;
    if (getKey) {
      this._getKeyFn = getKey;
    }
    if (multiple === true) {
      this._multiple = true;
      const { selecteds } = opts;
      if (Array.isArray(selecteds) && selecteds.length) {
        this.select(...selecteds);
      }
    } else {
      const { selecteds } = opts as { selecteds: T };
      if (selecteds) {
        this._markSelected(selecteds);
      }
    }
  }

  /**
   * Toggles a value between selected and deselected.
   */
  toggle(value: T): void {
    this.isSelected(value) ? this.deselect(value) : this.select(value);
  }

  /**
   * Selects one or several values.
   */
  select(...values: T[]): void {
    values.forEach(value => this._markSelected(value));
    this._clearSelectedValues();
  }

  /**
   * Deselects a value or an array of values.
   */
  deselect(...values: T[]): void {
    values.forEach(value => this._unmarkSelected(value));
    this._clearSelectedValues();
  }

  /**
   * Determines whether a value is selected.
   */
  isSelected(value: T): boolean {
    const key = this._getKeyFn(value);
    return this._selectionMap.has(key);
  }

  /**
   * Determines whether the model does not have a value.
   */
  isEmpty(): boolean {
    return this._selectionMap.size === 0;
  }

  /**
   * Determines whether the model has a value.
   */
  hasValue(): boolean {
    return this._selectionMap.size !== 0;
  }

  /**
   * Gets whether multiple values can be selected.
   */
  isMultipleSelection() {
    return this._multiple;
  }

  /**
   * Clears all of the selected values.
   */
  clear(): void {
    this._unmarkAll();
    this._clearSelectedValues();
  }

  /** Selects a value. */
  private _markSelected(value: T) {
    if (!this.isSelected(value)) {
      if (!this._multiple) {
        this._unmarkAll();
      }

      const key = this._getKeyFn(value);
      this._selectionMap.set(key, value);
    }
  }

  /** Deselects a value. */
  private _unmarkSelected(value: T) {
    if (this.isSelected(value)) {
      const key = this._getKeyFn(value);
      this._selectionMap.delete(key);
    }
  }

  /** Clears out the selected values. */
  private _unmarkAll() {
    if (!this.isEmpty()) {
      this._selectionMap.clear();
    }
  }
  /** Clear the selected values so they can be re-cached. */
  private _clearSelectedValues() {
    this._selected = null;
  }

}
