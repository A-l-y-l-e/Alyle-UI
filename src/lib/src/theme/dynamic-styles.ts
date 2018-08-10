import { ElementRef, Renderer2 } from '@angular/core';
import { LyTheme2 } from './theme2.service';
import { Style } from '@alyle/ui';

export class DynamicStyles {
  get classes() {
    return this.theme.classes;
  }
  constructor(
    private theme: LyTheme2
  ) {

  }
  setUpStyle<T>(id: string, style: Style<T>, el?: any, instance?: string) {
    const newClass = this.theme.setUpStyle<T>(id, style);
    if (instance) {
      el.classList.remove(instance);
    }
    el.classList.add(newClass);
    return newClass;
  }
}
