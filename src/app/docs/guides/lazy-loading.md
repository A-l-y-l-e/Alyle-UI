# Lazy Loading

Since the gestures do not work in lazy-loading (as `ly-carousel` and `ly-slider`), manually add the following:

```ts
import { HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { LyHammerGestureConfig } from '@alyle/ui';

@NgModule({
  ...
  imports: [
    ...
    HammerModule
  ],
  providers: [
    ...
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig }
  ]
})
export class AppModule { }
```
