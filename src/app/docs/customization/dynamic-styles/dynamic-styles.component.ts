import { Component, OnInit, Injectable, ElementRef, Renderer2 } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const myStyles = (theme) => ({
  root: {
    color: theme.primary.default,
    '&:hover': {
      color: theme.accent.default
    }
  }
});

@Injectable({
  providedIn: 'root'
})
export class DynamicStylesService {
  constructor(
    public theme: LyTheme2
  ) {
    this.theme.addStyleSheet(myStyles, 'myStyles');
  }
}

@Component({
  selector: 'aui-dynamic-styles',
  templateUrl: './dynamic-styles.component.html',
  styleUrls: ['./dynamic-styles.component.scss']
})
export class DynamicStylesComponent implements OnInit {
  classes = this.theme.classes;
  constructor(
    private dynamicStylesService: DynamicStylesService,
    private theme: LyTheme2
  ) { }

  ngOnInit() {
  }

}
