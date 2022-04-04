import { NgModule, Type } from '@angular/core';

import { SimpleListComponent } from './simple-list/simple-list.component';
import { FolderListComponent } from './folder-list/folder-list.component';
import { SimpleListModule } from './simple-list/simple-list.module';
import { FolderListModule } from './folder-list/folder-list.module';
import { WithCustomElementComponent } from '@app/docs/element-registry';

const elements = [
  SimpleListComponent,
  FolderListComponent
];

@NgModule({
  imports: [
    SimpleListModule,
    FolderListModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
