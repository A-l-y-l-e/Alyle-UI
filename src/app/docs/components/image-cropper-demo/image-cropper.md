
# Image Cropper
{@path /components}

Resize, rotate and crop images with Canvas.

e.g.

```html
<ly-img-cropper
  [config]="myConfig"
  [(scale)]="scale"
  (cropped)="onCropped($event)"
  (loaded)="onLoaded($event)"
  (error)="onError($event)"
>
  <span>Drag and drop image</span>
</ly-img-cropper>
<ly-slider
  [thumbVisible]="false"
  [min]="cropper.minScale"
  [max]="1"
  [(ngModel)]="scale"
  (input)="scale = $event.value"
  step="0.000001"></ly-slider>

```

```ts
export class MyComponent {
  scale: number;
  @ViewChild(LyImageCropper, { static: true }) cropper: LyImageCropper;
  myConfig: ImgCropperConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`
    type: 'image/png' // Or you can also use `image/jpeg`
  };
  onCropped(e: ImgCropperEvent) {
    console.log('Cropped img: ', e);
  }

  onLoaded(e: ImgCropperEvent) {
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

```ts
export class MyComponent {
  ...
  myConfig: ImgCropperConfig = {
    resizableArea: true,
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

You can use the <code class="ts">setImageUrl(src: string, fn?: () => void)</code> method.

<demo-view path="docs/components/image-cropper-demo/image-cropper-example-01">
  <image-cropper-example-01></image-cropper-example-01>
</demo-view>

## Crop Circle

~~For this just add the `border-radius: 50%` styles to the cropper area.~~

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
