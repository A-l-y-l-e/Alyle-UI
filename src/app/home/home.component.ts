import { Component, ChangeDetectionStrategy, Renderer2, ElementRef } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = ({
  root: {
    display: 'block'
  },
  intraContainer: {
    textAlign: 'center',
  },
  intraContent: {
    '& a': {
      margin: '8px'
    },
    '& > h2': {
      fontWeight: 300,
    },
    '& > h1': {
      fontFamily: `'Nunito', sans-serif`,
      letterSpacing: '-.04em'
    }
  },
  buttons: {
    display: 'inline-flex',
    paddingTop: '1em'
  }
});

@Component({
  selector: 'aui-home',
  templateUrl: './home.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  classes = this.theme.addStyleSheet(styles, 'aui-home');
  constructor(
    renderer: Renderer2,
    el: ElementRef,
    private theme: LyTheme2
  ) {
    renderer.addClass(el.nativeElement, this.classes.root);
  }
}
