import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ImgCropperConfig, ImgCropperEvent } from '@alyle/ui/resizing-cropping-images';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const styles = (theme: ThemeVariables) => ({
  actions: {
    display: 'flex'
  },
  cropping: {
    maxWidth: '400px',
    height: '300px'
  },
  flex: {
    flex: 1
  },
  range: {
    textAlign: 'center',
    maxWidth: '400px'
  },
  rangeInput: {
    maxWidth: '150px',
    margin: '1em 0',

    // http://brennaobrien.com/blog/2014/05/style-input-type-range-in-every-browser.html
    // removes default webkit styles
    '-webkit-appearance': 'none',

    // fix for FF unable to apply focus style bug
    border: `solid 6px ${theme.background.tertiary}`,

    // required for proper track sizing in FF
    width: '100%',
    '&::-webkit-slider-runnable-track': {
        width: '300px',
        height: '3px',
        background: '#ddd',
        border: 'none',
        borderRadius: '3px'
    },
    '&::-webkit-slider-thumb': {
        '-webkit-appearance': 'none',
        border: 'none',
        height: '16px',
        width: '16px',
        borderRadius: '50%',
        background: theme.primary.default,
        marginTop: '-6px'
    },
    '&:focus': {
        outline: 'none'
    },
    '&:focus::-webkit-slider-runnable-track': {
        background: '#ccc'
    },

    '&::-moz-range-track': {
        width: '300px',
        height: '3px',
        background: '#ddd',
        border: 'none',
        borderRadius: '3px'
    },
    '&::-moz-range-thumb': {
        border: 'none',
        height: '16px',
        width: '16px',
        borderRadius: '50%',
        background: theme.primary.default
    },

    // hide the outline behind the border
    '&:-moz-focusring': {
        outline: '1px solid white',
        outlineOffset: '-1px',
    },

    '&::-ms-track': {
        width: '300px',
        height: '3px',

        // remove bg colour from the track, we'll use ms-fill-lower and ms-fill-upper instead
        background: 'transparent',

        // leave room for the larger thumb to overflow with a transparent border
        borderColor: 'transparent',
        borderWidth: '6px 0',

        // remove default tick marks
        color: 'transparent'
    },
    '&::-ms-fill-lower': {
        background: '#777',
        borderRadius: '10px'
    },
    '&::-ms-fill-': {
        background: '#ddd',
        borderRadius: '10px',
    },
    '&::-ms-thumb': {
        border: 'none',
        height: '16px',
        width: '16px',
        borderRadius: '50%',
        background: theme.primary.default,
    },
    '&:focus::-ms-fill-lower': {
        background: '#888'
    },
    '&:focus::-ms-fill-upper': {
        background: '#ccc'
    }
  }
});

@Component({
  selector: 'resizing-cropping-images-example-01',
  templateUrl: './resizing-cropping-images-example-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class ResizingCroppingImagesExample01Component {
  classes = this.theme.addStyleSheet(styles);
  croppedImage: string;
  result: string;
  scale: number;
  myConfig: ImgCropperConfig = {
    autoCrop: true,
    width: 150, // Default `250`
    height: 150, // Default `200`
    fill: '#ff2997', // Default transparent if type = png else #000,
    type: 'image/jpeg'
  };

  constructor(
    private theme: LyTheme2
  ) { }

  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.dataURL;
    console.log('cropped img: ', e);
  }
  onloaded(e: ImgCropperEvent) {
    console.log('img loaded', e);
  }
  onerror(e: ImgCropperEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
  }

}
