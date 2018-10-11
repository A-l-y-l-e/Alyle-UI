import { Injectable, ElementRef, OnDestroy } from '@angular/core';

const MUTATION_OBSERVER_INIT = {
  characterData: true,
  childList: true,
  subtree: true
};

@Injectable({providedIn: 'root'})
export class MutationObserverFactory {
  create(callback: MutationCallback): MutationObserver | null {
    return typeof MutationObserver === 'undefined' ? null : new MutationObserver(callback);
  }
}

@Injectable({providedIn: 'root'})
export class ElementObserver implements OnDestroy {
  private _observedElements = new Map<Element, MutationObserver | null>();

  constructor(
    private _mutationObserverFactory: MutationObserverFactory
  ) { }

  ngOnDestroy() {
    this._observedElements.forEach((_, element) => this.destroy(element));
  }

  observe(elementOrRef: Element | ElementRef<Element>, fn: MutationCallback, options?: MutationObserverInit) {
    const element = elementOrRef instanceof ElementRef ? elementOrRef.nativeElement : elementOrRef;
    if (!this._observedElements.has(element)) {
      const observer = this._mutationObserverFactory.create(fn);
      if (observer) {
        observer.observe(element, options || MUTATION_OBSERVER_INIT);
      }
      this._observedElements.set(element, observer);
    }
    return this._observedElements.get(element);
  }

  /**
   * Destroy Observer
   */
  destroy(elementOrRef: Element | ElementRef<Element>) {
    const element = elementOrRef instanceof ElementRef ? elementOrRef.nativeElement : elementOrRef;
    if (this._observedElements.has(element)) {
      this._observedElements.get(element).disconnect();
      this._observedElements.delete(element);
    }
  }
}
