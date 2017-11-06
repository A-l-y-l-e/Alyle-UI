import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  ApplicationRef,
  TemplateRef,
  ComponentRef
} from '@angular/core';

@Injectable()
export class DomService {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  createComponentRef<T>(component: any, template: TemplateRef<any>): ComponentRef<T> {
    // 1. Create a component reference from the component
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);
      (componentRef as ComponentRef<any>).instance.tmpl(template);

    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    return componentRef as ComponentRef<T>;
  }

  addChild(child: HTMLElement, parent: HTMLElement = document.body) {
    parent.appendChild(child);
  }

  getDomElementFromComponentRef(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>)
    .rootNodes[0] as HTMLElement;
  }

  destroyRef(componentRef: ComponentRef<any>, delay: number) {
    setTimeout(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
  }, delay);
  }
}
