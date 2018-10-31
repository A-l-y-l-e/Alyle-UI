import { Injectable } from '@angular/core';
import { Platform } from '@alyle/ui';

const Prism = require('prismjs');
require('prismjs/plugins/custom-class/prism-custom-class');

@Injectable({
  providedIn: 'root'
})
export class PrismService {
  private state: boolean;
  setCustomClass(map: object) {
    if (Platform.isBrowser && !this.state) {
      this.state = true;
      Prism.plugins.customClass.map(map);
    }
  }
}
