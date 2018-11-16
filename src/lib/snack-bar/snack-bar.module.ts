import { NgModule } from '@angular/core';
import { LyOverlayModule } from '@alyle/ui';
import { LySnackBar } from './snack-bar';

@NgModule({
  imports: [LyOverlayModule],
  declarations: [LySnackBar],
  exports: [LySnackBar]
})
export class LySnackBarModule {}
