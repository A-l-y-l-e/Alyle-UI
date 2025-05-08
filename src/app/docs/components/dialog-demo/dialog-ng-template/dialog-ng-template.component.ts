import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyDialog } from '@alyle/ui/dialog';

export interface Fruit {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'aui-dialog-ng-template',
  templateUrl: './dialog-ng-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DialogNgTemplateComponent {

  constructor(
    public dialog: LyDialog
  ) { }

}
