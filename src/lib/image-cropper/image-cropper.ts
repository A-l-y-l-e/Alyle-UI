import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
  AfterViewInit,
  inject,
  booleanAttribute
} from '@angular/core';
import {
  LY_COMMON_STYLES,
  ThemeVariables,
  lyl,
  StyleCollection,
  LyClasses,
  StyleTemplate,
  StyleRenderer,
  WithStyles,
  Style,
  SelectorsFn,
} from '@alyle/ui';
import { NgIf, NgStyle } from '@angular/common';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { color } from '@alyle/ui/color';
import { _LyCropperAreaBase, _LyImageCropperBase } from './_image-cropper-base';

export interface LyImageCropperTheme {
  /** Styles for Image Cropper Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
}

export interface LyImageCropperVariables {
  cropper?: LyImageCropperTheme;
}

const STYLE_PRIORITY = -2;
const pos = (100 * Math.sqrt(2) - 100) / 2 / Math.sqrt(2);

export const STYLES = (theme: ThemeVariables & LyImageCropperVariables, selectors: SelectorsFn) => {
  const $$ = selectors(STYLES);
  const { after } = theme;
  const transition = `${theme.animations.curves.acceleration} 100ms`;
  return {
    $name: LyImageCropper.и,
    $priority: STYLE_PRIORITY,
    root: ( ) => lyl `{
      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none
      display: flex
      overflow: hidden
      position: relative
      justify-content: center
      align-items: center
      {
        ...${
          (theme.cropper
            && theme.cropper.root
            && (theme.cropper.root instanceof StyleCollection
              ? theme.cropper.root.setTransformer(fn => fn($$))
              : theme.cropper.root($$))
          )
        }
      }
    }`,
    cropperContainer: lyl `{
      position: relative
      margin: auto
      width: 80%
      height: 80%
    }`,
    imgContainer: lyl `{
      cursor: move
      position: absolute
      top: 0
      left: 0
      display: flex
      touch-action: none
      & > canvas {
        display: block
      }
    }`,
    overlay: lyl `{
      ...${LY_COMMON_STYLES.fill}
    }`,
    area: lyl `{
      pointer-events: none
      box-shadow: 0 0 0 20000px rgba(0, 0, 0, 0.4)
      ...${LY_COMMON_STYLES.fill}
      margin: auto
      &:before, &:after {
        ...${LY_COMMON_STYLES.fill}
        content: ''
      }
      &:before {
        width: 0
        height: 0
        margin: auto
        border-radius: 50%
        background: #fff
        border: solid 2px rgb(255, 255, 255)
      }
      &:after {
        border: solid 2px rgb(255, 255, 255)
        border-radius: inherit
      }
    }`,
    grid: lyl `{
      position: absolute
      width: 100%
      height: 100%
      opacity: 0
      transition: ${transition}
      &::before,
      &::after {
        content: ' '
        box-sizing: border-box
        position: absolute
        border: 1px solid ${color(0xffffff, 0.4)}
      }
      &::before {
        top: 0
        bottom: 0
        left: 33.33%
        right: 33.33%
        border-top: 0
        border-bottom: 0
      }
      &::after {
        top: 33.33%
        bottom: 33.33%
        left: 0
        right: 0
        border-left: 0
        border-right: 0
      }
    }`,
    showGrid: () => lyl `{
      ${$$.grid} {
        opacity: 1
      }
    }`,
    isPointerUp: null,
    resizer: lyl `{
      width: 10px
      height: 10px
      background: #fff
      border-radius: 3px
      position: absolute
      touch-action: none
      bottom: 0
      ${after}: 0
      pointer-events: all
      cursor: ${
        after === 'right'
          ? 'nwse-resize'
          : 'nesw-resize'
      }
      &:before {
        ...${LY_COMMON_STYLES.fill}
        content: ''
        width: 30px
        height: 30px
        transform: translate(-35%, -35%)
      }
    }`,
    defaultContent: lyl `{
      display: flex
      align-items: center
      justify-content: center
      &, & > input {
        ...${LY_COMMON_STYLES.fill}
      }
      & *:not(input) {
        pointer-events: none
      }
      & > input {
        background: transparent
        opacity: 0
        width: 100%
        height: 100%
      }
    }`
  };
};

/**
 * @dynamic
 */
@Component({
  selector: 'ly-cropper-area',
  templateUrl: './image-cropper-area.html',
  providers: [
    StyleRenderer
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lyCropperArea',
  standalone: true,
  imports: [NgIf],
})
export class LyCropperArea extends _LyCropperAreaBase implements WithStyles, OnDestroy {
  readonly sRenderer = inject(StyleRenderer);
  readonly classes = this.sRenderer.renderSheet(STYLES, 'area');

  @Input({
    transform: booleanAttribute
  })
  @Style<boolean, LyCropperArea>(
    (_value, _media) => ({ after }, selectors: SelectorsFn) => {
      const $$ = selectors(STYLES);
      return lyl `{
        border-radius: 50%
        ${$$.resizer} {
          ${after}: ${pos}%
          bottom: ${pos}%
          transform: translate(4px, 4px)
        }
        ${$$.grid} {
          border-radius: 50%
          overflow: hidden
        }
      }`;
    },
    coerceBooleanProperty
  ) round: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  selector: 'ly-img-cropper, ly-image-cropper',
  templateUrl: 'image-cropper.html',
  providers: [
    StyleRenderer,
    {provide: _LyImageCropperBase, useExisting: LyImageCropper},
  ],
  standalone: true,
  imports: [LyCropperArea, NgStyle, NgIf]
})
export class LyImageCropper extends _LyImageCropperBase implements OnInit, AfterViewInit, OnDestroy {

  readonly sRenderer = inject(StyleRenderer);
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  override areaGridActiveCssClass = this.classes.showGrid;
}
