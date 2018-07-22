import { Component, OnInit } from '@angular/core';
import { FxDirection, FxJustifyContent, FxAlignItemsAndContent, FxAlignItems, FxAlignContent, FxWrap } from '@alyle/ui/flex';

@Component({
  selector: 'flex-demo-one',
  templateUrl: './flex-demo-one.component.html',
  styleUrls: ['./flex-demo-one.component.css']
})
export class FlexDemoOneComponent implements OnInit {
  items = Array.from(Array(10).keys());
  align = 'center';
  direction: FxDirection = 'row';
  wrap: FxWrap = 'wrap';
  crossAlign: FxAlignItems = 'center';
  multiAlign: FxAlignContent = null;
  directionList: FxDirection[] = ['row', 'rowReverse', 'column', 'columnReverse', null];
  wrapList: FxWrap[] = ['nowrap', 'wrap', 'wrap-reverse', null];
  justifyContentList: FxJustifyContent[] = ['start', 'center', 'end', 'between', 'around', 'evenly', null];
  alignItemsList: FxAlignItems[] = ['start', 'end', 'center', 'baseline', 'stretch', null];
  alignContentList: FxAlignContent[] = ['start', 'end', 'center', 'between', 'around', 'stretch', null];
  alignItemsAndContentList: FxAlignItemsAndContent[] = ['start', 'center', 'end', 'stretch', null];
  responsiveState: boolean;
  responsive: string[];
  constructor() { }
  toggleFx() {
    this.responsiveState = !this.responsiveState;
    if (this.responsiveState) {
      this.responsive = ['direction:row:Small', 'direction:column:Medium'];
    } else {
      this.responsive = ['direction:column:Small', 'direction:row:Medium'];
    }
  }
  ngOnInit() {
    this.toggleFx();
  }

}
