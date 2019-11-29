import { NgModule, Type } from '@angular/core';
import { AvatarWithButtonModule } from './avatar-with-button/avatar-with-button.module';
import { BasicUsesAvatarModule } from './basic-uses-avatar/basic-uses-avatar.module';
import { AvatarWithButtonComponent } from './avatar-with-button/avatar-with-button.component';
import { BasicUsesAvatarComponent } from './basic-uses-avatar/basic-uses-avatar.component';


const elements = [
  AvatarWithButtonComponent,
  BasicUsesAvatarComponent
];

@NgModule({
  imports: [
    AvatarWithButtonModule,
    BasicUsesAvatarModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
