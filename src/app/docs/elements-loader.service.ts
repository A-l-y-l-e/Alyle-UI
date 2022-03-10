import { Injectable, Inject, Type, createNgModuleRef, NgModuleRef } from '@angular/core';
import { ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN, WithCustomElementComponent } from './element-registry';
import { LoadChildrenCallback } from '@angular/router';
import { createCustomElement } from '@angular/elements';

@Injectable()
export class ElementsLoader {
  /** Map of unregistered custom elements and their respective module paths to load. */
  private elementsToLoad: Map<string, LoadChildrenCallback>;
  /** Map of custom elements that are in the process of being loaded and registered. */
  private elementsLoading = new Map<string, Promise<void>>();
  constructor(
    private moduleRef: NgModuleRef<any>,
    @Inject(ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN) elementModulePaths: Map<string, LoadChildrenCallback>
  ) {
    this.elementsToLoad = new Map(elementModulePaths);
  }

  load(path: string) {
    if (this.elementsLoading.has(path)) {
      // The custom element is in the process of being loaded and registered.
      return this.elementsLoading.get(path) as Promise<void>;
    }

    if (this.elementsToLoad.has(path)) {
      // Load and register the custom element (for the first time).
      const modulePathLoader = this.elementsToLoad.get(path) as LoadChildrenCallback;
      const loadedAndRegistered =
        (modulePathLoader() as Promise<Type<WithCustomElementComponent>>)
          .then(elementModule => {
            const elementModuleRef = createNgModuleRef(elementModule, this.moduleRef.injector);
            const injector = elementModuleRef.injector;
            const CustomElementComponents = elementModuleRef.instance.customElementComponents;
            return Promise.all(CustomElementComponents.map(comp => {
              const selector = (comp as any).ɵcmp.selectors[0][0];
              const CustomElement = createCustomElement(comp, {injector});
              customElements.define(selector, CustomElement);
              return customElements.whenDefined(selector);
            }));

          })
          .then(() => {
            // The custom element has been successfully loaded and registered.
            // Remove from `elementsLoading` and `elementsToLoad`.
            this.elementsLoading.delete(path);
            this.elementsToLoad.delete(path);
          })
          .catch(err => {
            // The custom element has failed to load and register.
            // Remove from `elementsLoading`.
            // (Do not remove from `elementsToLoad` in case it was a temporary error.)
            this.elementsLoading.delete(path);
            return Promise.reject(err);
          });

      this.elementsLoading.set(path, loadedAndRegistered);
      return loadedAndRegistered;
    }

    // The custom element has already been loaded and registered.
    return Promise.resolve();
  }


}
