import { Injectable, Host, SkipSelf, Optional, Self } from '@angular/core';
import { Observable ,  of as observableOf } from 'rxjs';
import { LyTheme2, LyThemeContainer, CoreTheme } from '@alyle/ui';
import { LyCarouselModule } from './carousel.module';
@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  constructor(
    private coreTheme: CoreTheme
  ) {}

}
