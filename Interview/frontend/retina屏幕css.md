# Have you ever worked with retina graphics? If so, when and what techniques did you use?

On retina devices the websites are not broken. They just look vague and pixels start appearing as low resolution images. So the only way to correct is to resize the images by following one of the techniques below:

1. Using alternate high resolution pixels (**图片是 css 宽高的2倍**)

Suppose we have an image of 200px by 400px (CSS pixels) and we want to display it properly in a retina display, we can upload an alternate image of size 400px by 800px in our server and render them whenever the webpage is opened in a retina device.

```css
#element { background-image: url('hires.png'); }

@media only screen and (min-device-pixel-ratio: 2) {
    #element { background-image: url('hires@2x.png'); }
}

@media only screen and (min-device-pixel-ratio: 3) {
    #element { background-image: url('hires@3x.png'); }
}
```

1. Using JavaScript to replace all the images with double sized image. 弊端是 retina 屏幕会把1倍图片、2倍图片都下载，速度慢。

```javascript
$(document).ready(function() {
  if (window.devicePixelRatio > 1) {
    var lowResolutionImages = $('img');

    images.each(function(i) {
      var lowResolution = $(this).attr('src');
      var highResolution = lowResolution.replace('.', '@2x.');
      $(this).attr('src', highResolution);
    });
  }
});
```

1. Using `@face-fonts` instead of images icon(✅)

Image fonts will automatically resize themselves on the high resolution devices just like normal fonts do.

1. Using `SVG images` instead of Bitmap images(✅)
