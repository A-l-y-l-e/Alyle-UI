import { Injectable, Injector, Compiler, Inject, NgModuleFactory, Type } from '@angular/core';
import { ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN } from './element-registry';
import { LoadChildrenCallback } from '@angular/router';
import { Platform } from '@angular/cdk/platform';

@Injectable()
export class ElementsLoader {
  private registeredElements = new Set<string>();
  constructor(
    private injector: Injector,
    private compiler: Compiler,
    private platform: Platform,
    @Inject(ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN) private elementModulePaths: Map<string, LoadChildrenCallback>
  ) { }

  async load(path: string) {
    if (!this.registeredElements.has(path) && this.elementModulePaths.has(path)) {
      this.registeredElements.add(path);

      const tempModule = await (
        this.elementModulePaths.get(path)!() as Promise<NgModuleFactory<any> | Type<any> | null>
      )
      .catch(reason => console.error(reason));

      if (!tempModule) {
        // do nothing
        return;
      }
      let moduleFactory: NgModuleFactory<any>;

      if (tempModule instanceof NgModuleFactory) {
        // For AOT
        moduleFactory = tempModule;
      } else {
        // For JIT
        moduleFactory = await this.compiler.compileModuleAsync(tempModule);
      }

      const components = (moduleFactory.moduleType as any).entryComponents as Type<any>[];
      const moduleRef = moduleFactory.create(this.injector);
      const injector = moduleRef.injector;

      // const compFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(entryComponent);

      // container.createComponent(compFactory);
      if (this.platform.isBrowser) {
        const { createCustomElement } = require('@angular/elements');
        await Promise.all(components.map((comp) => {
          const compFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(comp);
          const element = createCustomElement(comp, { injector });
          const selector = compFactory.selector;
          // Register the custom element with the browser.
          customElements.define(selector, element);
          return customElements.whenDefined(selector);
        }));
      }


    }
  }


}
