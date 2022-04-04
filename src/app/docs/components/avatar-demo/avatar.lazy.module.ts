import { NgModule, Type } from '@angular/core';
import { AvatarWithButtonModule } from './avatar-with-button/avatar-with-button.module';
import { BasicUsesAvatarModule } from './basic-uses-avatar/basic-uses-avatar.module';
import { AvatarWithButtonComponent } from './avatar-with-button/avatar-with-button.component';
import { BasicUsesAvatarComponent } from './basic-uses-avatar/basic-uses-avatar.component';
import { WithCustomElementComponent } from '@app/docs/element-registry';


const elements = [
  AvatarWithButtonComponent,
  BasicUsesAvatarComponent
];

@NgModule({
  imports: [
    AvatarWithButtonModule,
    BasicUsesAvatarModule
  ],
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
