import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomService } from './dom.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [DomService]
})
export class LxDomModule { }
