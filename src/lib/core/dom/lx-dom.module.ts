import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomService } from './dom.service';
import { LY_OVERLAY_CONTAINER_PROVIDER } from './overlay-container.component';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [DomService, LY_OVERLAY_CONTAINER_PROVIDER]
})
export class LxDomModule { }
