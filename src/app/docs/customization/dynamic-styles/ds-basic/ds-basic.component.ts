import { Component, Injectable, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

/**
 * Basic style
 * @param theme Theme config
 */
const myStyles = (theme) => ({
  root: {                         // this would be like the name of the class
    color: theme.primary.default, // style
    '&:hover': {                  // `&`is equal to `root` and therefore it would be 'root:hover'
      color: theme.accent.default // style
    }
  },
  buttonLink: {
    color: theme.accent.default,
    'text-decoration': 'inherit',
    '&:hover': {
      'text-decoration': 'underline'
    }
  }
});

@Injectable({ providedIn: 'root' })
export class DynamicStylesService {
  classes;
  constructor(
    private theme: LyTheme2
  ) {
    this.classes = this.theme.addStyleSheet(myStyles, 'myStyles');
  }
}

@Component({
  selector: 'aui-ds-basic',
  templateUrl: './ds-basic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsBasicComponent {
  classes = this.dynamicStylesService.classes;

  constructor(
    private dynamicStylesService: DynamicStylesService
  ) { }

}
