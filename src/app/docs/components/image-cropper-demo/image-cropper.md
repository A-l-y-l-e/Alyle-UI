
# Image Cropper
{@path /components}

Resize, rotate and crop images with Canvas.

By default if a file that is not an image is loaded, an error will be emit, the error can be captured by the `error` event.

## Rotate Image

For rotation we can use the `rotate(degrees: number)` method.

It can only be rotated 90 degrees, in each execution, for example, it cannot be rotated from 0 to 45 degrees. And if the number is negative, it will rotate counterclockwise

e.g.

```html
<button (click)="cropper.rotate(-90)">rotate counterclockwise</button>
or
<button (click)="cropper.rotate(90)">rotate clockwise</button>
```

## Cropper With Dialog

<demo-view path="docs/components/image-cropper-demo/cropper-with-dialog">
  <aui-cropper-with-dialog></aui-cropper-with-dialog>
</demo-view>

## Cropper image from URL

We can use the `setImageUrl(url, setImageUrl(src: string, fn?: () => void))` method.

<demo-view path="docs/components/image-cropper-demo/image-cropper-example-01">
  <image-cropper-example-01></image-cropper-example-01>
</demo-view>

## Just crop image
<demo-view path="docs/components/image-cropper-demo/image-cropper-example-02">
  <image-cropper-example-02></image-cropper-example-02>
</demo-view>

## Set output image
<demo-view path="docs/components/image-cropper-demo/image-cropper-example-03">
  <image-cropper-example-03></image-cropper-example-03>
</demo-view>
