import { NgModule, Type } from '@angular/core';

import { BasicDialogComponent } from './basic-dialog/basic-dialog.component';
import { DialogResponsiveComponent } from './dialog-responsive/dialog-responsive.component';
import { FullScreenDialogComponent } from './full-screen-dialog/full-screen-dialog.component';
import { DialogPromptComponent } from './dialog-prompt/dialog-prompt.component';
import { DialogNgTemplateComponent } from './dialog-ng-template/dialog-ng-template.component';
import { BasicDialogModule } from './basic-dialog/basic-dialog.module';
import { DialogResponsiveModule } from './dialog-responsive/dialog-responsive.module';
import { FullScreenDialogModule } from './full-screen-dialog/full-screen-dialog.module';
import { DialogPromptModule } from './dialog-prompt/dialog-prompt.module';
import { DialogNgTemplateModule } from './dialog-ng-template/dialog-ng-template.module';
import { DialogWithSelectComponent } from './dialog-with-select/dialog-with-select.component';
import { DialogWithSelectModule } from './dialog-with-select/dialog-with-select.module';
import { WithCustomElementComponent } from '@app/docs/element-registry';


const elements = [
  BasicDialogComponent,
  DialogResponsiveComponent,
  FullScreenDialogComponent,
  DialogPromptComponent,
  DialogNgTemplateComponent,
  DialogWithSelectComponent
];

@NgModule({
  imports: [
    BasicDialogModule,
    DialogResponsiveModule,
    FullScreenDialogModule,
    DialogPromptModule,
    DialogNgTemplateModule,
    DialogWithSelectModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
