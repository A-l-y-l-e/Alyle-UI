import { Injectable } from '@angular/core';

/**
 * LyTemplate
 *
 * @export
 * @class LyTemplate
 */
@Injectable()
export class LyTemplate {
  private _container: any;
  private ___templateRef: any;
  public setTemplate(viewContainercRef: any) {
    // let tRef: any = this.viewContainerRef.createEmbeddedView(this.templateRef);
    this.___templateRef = viewContainercRef;
    return this.___templateRef;
  }
  public nodes(refx: any) {
    const ref = refx;
    const template = document.createElement('l-y-t-e-m-p-l-a-t-e');
    ref.rootNodes.forEach((root: any) => {
      template.appendChild(root);
    });
    return template;
  }
}
