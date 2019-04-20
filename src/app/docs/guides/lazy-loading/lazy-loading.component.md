For a component of Alyle UI to work properly with Lazy loading, it is important that the themes should be added in the root module of the application, not in the submodules.

```ts
/** Import themes */
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import {
  LyThemeModule,
  LY_THEME
} from '@alyle/ui';

@NgModule({
  imports: [
    ...
    // Set main theme
    LyThemeModule.setTheme('minima-light'),
  ],
  providers: [
    ...
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
    { provide: LY_THEME, useClass: MinimaDark, multi: true } // name: `minima-dark`
  ]
})
export class AppModule { }
```

And so that the `ly-carousel` and `ly-img-cropper` the gestures, add the following in `app.module.ts`.

```ts
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { LyHammerGestureConfig } from '@alyle/ui';

@NgModule({
  ...
  // Set main theme
  LyThemeModule.setTheme('minima-light'),
  providers: [
    ...
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
    { provide: LY_THEME, useClass: MinimaDark, multi: true }, // name: `minima-dark`
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig }
  ]
})
export class AppModule { }
```
