import {
  Injectable,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  TemplateRef,
  ComponentRef,
  ViewContainerRef,
  ViewRef
} from '@angular/core';
import { LyOverlayContainer } from './overlay-container';

@Injectable()
export class DomService {
  private _viewContainerRef: ViewContainerRef;
  private _viewRef: ViewRef;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private overlayContainer: LyOverlayContainer
  ) { }

  attach<T>(_hostViewContainerRef: ViewContainerRef, component: any, template: TemplateRef<any>) {
      const viewRef = _hostViewContainerRef.createEmbeddedView(template);
      viewRef.detectChanges();
      this._viewContainerRef = _hostViewContainerRef;
      viewRef.rootNodes.forEach(rootNode => this.addChild(rootNode));
  }

  addChild(child: HTMLElement) {
    this.overlayContainer.containerElement.appendChild(child);
  }

  getDomElementFromComponentRef(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>)
    .rootNodes[0] as HTMLElement;
  }

  destroyRef(componentRef: ComponentRef<any>, delay: number) {
    setTimeout(() => {
      if (this._viewContainerRef) {
        this._viewContainerRef.remove();
      }
    }, delay);
  }
}
