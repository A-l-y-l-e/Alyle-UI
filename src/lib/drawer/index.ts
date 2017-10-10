import { NgModule, ModuleWithProviders, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyNav, LySidenav } from './drawer';
import { RandomId, LyTemplate } from 'alyle-ui/core';
export * from './drawer';

export function randomIdFactory() {
  return new RandomId();
}

@NgModule({
  imports: [CommonModule],
  exports: [LyNav, LySidenav],
  declarations: [LyNav, LySidenav],
  providers: [
    { provide: RandomId, useFactory: randomIdFactory },
    LyTemplate
  ],
})
export class LyDrawerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LyDrawerModule,
    };
  }
}
