import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'aui-basic-skeleton',
  templateUrl: './basic-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class BasicSkeletonComponent {
  isLoading = true;
}
