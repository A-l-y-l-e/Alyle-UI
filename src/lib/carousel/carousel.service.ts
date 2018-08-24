import { Injectable } from '@angular/core';
import { CoreTheme } from '@alyle/ui';
@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  constructor(
    private coreTheme: CoreTheme
  ) {}

}
