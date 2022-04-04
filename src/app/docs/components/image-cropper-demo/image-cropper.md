
# Image Cropper
{@path /components}

Resize, rotate and crop images with Canvas.

Add the <code class="html"><ly-img-cropper></code> to your template:

```html
<ly-img-cropper
  [config]="myConfig"
  [(scale)]="scale"
  (ready)="onReady($event)"
  (minScale)="minScale = $event"
  (cleaned)="ready = false"
  (cropped)="onCropped($event)"
  (loaded)="onLoaded($event)"
  (error)="onError($event)"
>
  <span>Drag and drop image</span>
</ly-img-cropper>

<ng-container *ngIf="ready">
  <ly-slider
    [thumbVisible]="false"
    [min]="minScale"
    [max]="1"
    [(ngModel)]="scale"
    (input)="scale = $event.value"
    step="0.000001"></ly-slider>
</ng-container>

```

You can use [`ImgCropperConfig`](https://alyle.io/api/@alyle/ui/image-cropper/ImgCropperConfig) to configure the cropper.


```ts
export class MyComponent {
  ready: boolean;
  scale: number;
  minScale: number;
  @ViewChild(LyImageCropper, { static: true }) cropper: LyImageCropper;
  myConfig: ImgCropperConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`
    type: 'image/png', // Or you can also use `image/jpeg`
    output: {
      width: 200
    }
  };
  onCropped(e: ImgCropperEvent) {
    console.log('Cropped img: ', e);
  }

  onReady(e: ImgCropperEvent) {
    this.ready = true;
    console.log('Img ready for cropper', e);
  }

  onError(e: ImgCropperErrorEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
  }
}
```

## Rotate Image


For rotation we can use the <code class="ts">rotate(degrees: number)</code> method.

It can only be rotated 90 degrees, in each execution, for example, it cannot be rotated from 0 to 45 degrees. And if the number is negative, it will rotate counterclockwise

e.g.

```html
<button (click)="cropper.rotate(-90)">rotate counterclockwise</button>
or
<button (click)="cropper.rotate(90)">rotate clockwise</button>
```

## Error Handling

By default if a file that is not an image is loaded, an error will be emit, the error can be captured by the `error` event.

e.g.

```html
<ly-img-cropper
  ...
  (error)="onError($event)"
>
```

```ts
onError(e: ImgCropperErrorEvent) {
  console.warn(`'${e.name}' is not a valid image`, e);
}
```

## Cropper with Dialog and resizable area

Use `resizableArea` to have a resizable cropper area.

The below example is shown with `resizableArea` and `keepAspectRatio`, by default they are disabled.

```ts
export class MyComponent {
  ...
  myConfig: ImgCropperConfig = {
    resizableArea: true,
    keepAspectRatio: true
    ...
  };
}
```

<demo-view
  path="docs/components/image-cropper-demo/cropper-with-dialog"
  extra-paths="cropper-dialog.ts,cropper-dialog.html"
>
  <aui-cropper-with-dialog></aui-cropper-with-dialog>
</demo-view>

## Cropper image from URL

You can use the <code class="ts">loadImage(config: ImgCropperLoaderConfig)</code> method.

```ts
const config = {
  scale: 0.745864772531767,
  xOrigin: 642.380608078103,
  yOrigin: 236.26357452128866,
  // areaWidth: 100, // Use when cropper area is not fixed
  // areaHeight: 100,
  rotation: 0,
  originalDataURL: 'https://...'
};
this.cropper.loadImage(config);
```

<demo-view path="docs/components/image-cropper-demo/image-cropper-example-01">
  <image-cropper-example-01></image-cropper-example-01>
</demo-view>

## Full cropper area width

The demo below has an aspect ratio of 3:1 and results in an image with a maximum width of 600px.

```ts
myConfig: ImgCropperConfig = {
  width: 200 * 3,
  height: 200,
  keepAspectRatio: true,
  responsiveArea: true,
  output: ImgResolution.OriginalImage,
};
```

<demo-view path="docs/components/image-cropper-demo/aui-full-cropper-width">
  <aui-full-cropper-width></aui-full-cropper-width>
</demo-view>

## Crop Circle

You can add `round` to the cropper config. If set to true, `keepAspectRatio` will also be true (since an oval image would not make sense).

```ts
myConfig: ImgCropperConfig = {
  width: 150,
  height: 150,
  round: true,
  ...
};
```

<demo-view path="docs/components/image-cropper-demo/crop-circle">
  <aui-crop-circle></aui-crop-circle>
</demo-view>

## Just crop image

Just crop the output image and it is not resized. 

<demo-view path="docs/components/image-cropper-demo/image-cropper-example-02">
  <image-cropper-example-02></image-cropper-example-02>
</demo-view>

## Set output image

If you want the output image to always be `40x40`.

```ts
myConfig: ImgCropperConfig = {
  width: 150,
  height: 150,
  type: 'image/png',
  output: {
    width: 40,
    height: 40
  },
  ...
};
```

You can also just define `width` or `height`.

```ts
myConfig: ImgCropperConfig = {
  width: 150,
  height: 150,
  type: 'image/png',
  output: {
    width: 40,
    height: 0 // Will be defined automatically
  },
  ...
};
```

<demo-view path="docs/components/image-cropper-demo/image-cropper-example-03">
  <image-cropper-example-03></image-cropper-example-03>
</demo-view>
