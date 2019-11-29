import { NgModule, Type } from '@angular/core';

import { SimpleListComponent } from './simple-list/simple-list.component';
import { FolderListComponent } from './folder-list/folder-list.component';
import { SimpleListModule } from './simple-list/simple-list.module';
import { FolderListModule } from './folder-list/folder-list.module';

const elements = [
  SimpleListComponent,
  FolderListComponent
];

@NgModule({
  imports: [
    SimpleListModule,
    FolderListModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
