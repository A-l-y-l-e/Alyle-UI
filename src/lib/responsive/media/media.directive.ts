import {
  Directive,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  AfterViewInit,
  OnDestroy,
  EmbeddedViewRef
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Responsive } from '../media.service';

@Directive({
  selector: '[lyResponsive]'
})
export class MediaDirective implements OnDestroy {
  private _media: string;
  view: Subscription;
  private _TemplateRef: TemplateRef<any>|null = null;

  @Input()
  set lyResponsive(val: string) {
    this._media = val;
    this.updateView();
  }

  get media(): string {
    return this._media;
  }
  constructor(
    private _viewContainer: ViewContainerRef,
    templateRef: TemplateRef<any>,
    private mediaService: Responsive,
  ) {
    this._TemplateRef = templateRef;
    this.view = this.mediaService.stateView.subscribe(() => {
      this.updateView();
    });
  }

  updateView() {
    if (this.mediaService.matchMedia(this._media)) {
      if (this._viewContainer.length === 0) {
        this._viewContainer.createEmbeddedView(this._TemplateRef);
      }
    } else if (this._viewContainer.length !== 0) {
      this._viewContainer.clear();
    }
  }

  ngOnDestroy() {
    this.view.unsubscribe();
  }

}
