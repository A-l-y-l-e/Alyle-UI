import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { _LyCropperAreaBase, _LyImageCropperBase } from './_image-cropper-base';

/**
 * @dynamic
 */
@Component({
  selector: 'ly-cropper-area-base',
  templateUrl: './image-cropper-area-base.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lyCropperAreaBase',
  standalone: true,
  host: {
    'class': 'ly-cropper-area'
  }
})
export class LyCropperAreaBase extends _LyCropperAreaBase implements OnDestroy { }

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ly-img-cropper-base, ly-image-cropper-base',
  templateUrl: 'image-cropper-base.html',
  styleUrl: 'image-cropper-base.scss',
  providers: [
    {provide: _LyImageCropperBase, useExisting: LyImageCropperBase},
  ],
  standalone: true,
  exportAs: 'lyImageCropperBase',
  imports: [LyCropperAreaBase, NgStyle],
  host: {
    'class': 'ly-cropper-root'
  },
  encapsulation: ViewEncapsulation.None
})
export class LyImageCropperBase extends _LyImageCropperBase implements OnInit, AfterViewInit, OnDestroy {
  override areaGridActiveCssClass = 'ly-cropper-area-grid-active';
}
