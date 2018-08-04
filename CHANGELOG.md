<a name="1.7.0-beta.461kq"></a>
# [1.7.0-beta.461kq](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.3wtkb...1.7.0-beta.461kq) (2018-08-04)


### Bug Fixes

* **button:** fix size button ([d445db2](https://github.com/A-l-y-l-e/Alyle-UI/commit/d445db2))
* **card:** fix elevation with value 0 ([efaae25](https://github.com/A-l-y-l-e/Alyle-UI/commit/efaae25))
* **card:** rename aspectRatio to ratio ([194f4d6](https://github.com/A-l-y-l-e/Alyle-UI/commit/194f4d6))


### Features

* **button:** add small, medium & large button ([b805de3](https://github.com/A-l-y-l-e/Alyle-UI/commit/b805de3))
* **card:** add ly-card-content & ly-card-card-actions ([916f43a](https://github.com/A-l-y-l-e/Alyle-UI/commit/916f43a))
* **card:** add ly-card-media ([aba7d55](https://github.com/A-l-y-l-e/Alyle-UI/commit/aba7d55))
* **typography:** add gutter ([8877028](https://github.com/A-l-y-l-e/Alyle-UI/commit/8877028))



<a name="1.7.0-beta.3wtkb"></a>
# [1.7.0-beta.3wtkb](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.3vwyc...1.7.0-beta.3wtkb) (2018-07-30)


### Bug Fixes

* **button:** use typography variables for style ([42b800c](https://github.com/A-l-y-l-e/Alyle-UI/commit/42b800c))
* **theme:** remove logs ([1b95473](https://github.com/A-l-y-l-e/Alyle-UI/commit/1b95473))



<a name="1.7.0-beta.3vwyc"></a>
# [1.7.0-beta.3vwyc](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.3pcd9...1.7.0-beta.3vwyc) (2018-07-29)


### Bug Fixes

* **docs:** fix demos for card & typography ([bf04c66](https://github.com/A-l-y-l-e/Alyle-UI/commit/bf04c66))


### Documentation

* **theme:** update theme ([a4c0105](https://github.com/A-l-y-l-e/Alyle-UI/commit/a4c0105))


### Features

* **theme:** add LyThemeModule ([628491a](https://github.com/A-l-y-l-e/Alyle-UI/commit/628491a))


### BREAKING CHANGES

* **theme:** for theming use LyThemeModule or MinimaThemeModule

To set a new theme you should import LyThemeModule

example:

Before:

```html
<element lyTheme="minima-dark">
```

After:


```ts
// app.module.ts
// Available themes: minima-dark & minima-light

@NgModule({
  ...
   LyThemeModule.setTheme('minima-dark')
})
```

examples for child theme:

Before:

```ts
@NgModule({
  ...
   LyCommonModule, // <-- theme, bg, color, raised & others
})
```

```html
<element lyTheme="minima-dark">
```

After:

import theme

```ts
@NgModule({
  ...
  LyCommonModule, // <-- bg, color, raised & others
  MinimaThemeModule // <-- themes
})
```

```html
<element ly-theme-minima-dark>
```



<a name="1.7.0-beta.3pcd9"></a>
# [1.7.0-beta.3pcd9](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.3jiq1...1.7.0-beta.3pcd9) (2018-07-26)


### Features

* **core:** add parameter for Style ([34405d2](https://github.com/A-l-y-l-e/Alyle-UI/commit/34405d2))
* **theme:** update theme ([feb65fb](https://github.com/A-l-y-l-e/Alyle-UI/commit/feb65fb))
* **typography:** initial commit for typography ([288b9e3](https://github.com/A-l-y-l-e/Alyle-UI/commit/288b9e3))



<a name="1.7.0-beta.3jiq1"></a>
# [1.7.0-beta.3jiq1](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.21zck...1.7.0-beta.3jiq1) (2018-07-23)


### Bug Fixes

* **doc:** fix docs ([2672bab](https://github.com/A-l-y-l-e/Alyle-UI/commit/2672bab))


### Features

* **docs:** update docs ([ce3e0dc](https://github.com/A-l-y-l-e/Alyle-UI/commit/ce3e0dc))
* **grid:** add initial grid ([45904b3](https://github.com/A-l-y-l-e/Alyle-UI/commit/45904b3)), closes [#40](https://github.com/A-l-y-l-e/Alyle-UI/issues/40) [#41](https://github.com/A-l-y-l-e/Alyle-UI/issues/41)


### Performance Improvements

* **flex:** generate style only when the key is different ([a6fc154](https://github.com/A-l-y-l-e/Alyle-UI/commit/a6fc154))


### BREAKING CHANGES

* **grid:** * `@alyle/ui/flex` is now in @alyle/ui/layout



<a name="1.7.0-beta.21zck"></a>
# [1.7.0-beta.21zck](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.1j64w...1.7.0-beta.21zck) (2018-06-24)


### Features

* **responsive:** add lyShow & lyHide ([f4dfd04](https://github.com/A-l-y-l-e/Alyle-UI/commit/f4dfd04))


### Performance Improvements

* **carousel:** fix animations ([d55a48f](https://github.com/A-l-y-l-e/Alyle-UI/commit/d55a48f))



<a name="1.7.0-beta.21zck"></a>
# [1.7.0-beta.21zck](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.1j64w...1.7.0-beta.21zck) (2018-06-24)


### Features

* **responsive:** add lyShow & lyHide ([f4dfd04](https://github.com/A-l-y-l-e/Alyle-UI/commit/f4dfd04))


### Performance Improvements

* **carousel:** fix animations ([d55a48f](https://github.com/A-l-y-l-e/Alyle-UI/commit/d55a48f))



<a name="1.7.0-beta.1j64w"></a>
# [1.7.0-beta.1j64w](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.1fomk...1.7.0-beta.1j64w) (2018-06-14)


### Bug Fixes

* **button:** set ViewEncapsulation.None ([725a605](https://github.com/A-l-y-l-e/Alyle-UI/commit/725a605))
* **carousel:** add styles to slideContainer ([3639ac6](https://github.com/A-l-y-l-e/Alyle-UI/commit/3639ac6))
* **carousel:** fix interval ([126e420](https://github.com/A-l-y-l-e/Alyle-UI/commit/126e420))
* **carousel:** fix slide event ([196e7b8](https://github.com/A-l-y-l-e/Alyle-UI/commit/196e7b8))
* **carousel:** remove styleUrls ([e444309](https://github.com/A-l-y-l-e/Alyle-UI/commit/e444309))


### Features

* **carousel:** add slideEvent ([ed63f0b](https://github.com/A-l-y-l-e/Alyle-UI/commit/ed63f0b))
* **docs:** update get-started ([33a90b7](https://github.com/A-l-y-l-e/Alyle-UI/commit/33a90b7))



<a name="1.7.0-beta.1fomk"></a>
# 1.7.0-beta.1fomk (2018-06-12)


### Bug Fixes

* **bg, color:** change to createStyle ([817d6c8](https://github.com/A-l-y-l-e/Alyle-UI/commit/817d6c8))
* **core:** Support for angular universal ([4504557](https://github.com/A-l-y-l-e/Alyle-UI/commit/4504557))
* **core:** Support for universal ([6851d28](https://github.com/A-l-y-l-e/Alyle-UI/commit/6851d28))
* **docs:** update bg & color docs ([1476dda](https://github.com/A-l-y-l-e/Alyle-UI/commit/1476dda))
* **prism:** remove comments ([cb15680](https://github.com/A-l-y-l-e/Alyle-UI/commit/cb15680))
* **ripple:** create dynamic styles ([c6c40ef](https://github.com/A-l-y-l-e/Alyle-UI/commit/c6c40ef))
* **shadow:** error default shadow ([54c0210](https://github.com/A-l-y-l-e/Alyle-UI/commit/54c0210))
* **shadow:** replace setClassName to updateRootClass ([6a59ec2](https://github.com/A-l-y-l-e/Alyle-UI/commit/6a59ec2))
* **shadow:** update demo ([9fe97b6](https://github.com/A-l-y-l-e/Alyle-UI/commit/9fe97b6))
* **shadow:** update shadow on change theme ([6c06a7f](https://github.com/A-l-y-l-e/Alyle-UI/commit/6c06a7f))
* **theme:** multiple themes ([0eaee7d](https://github.com/A-l-y-l-e/Alyle-UI/commit/0eaee7d))
* **theme:** scheme ([1f178c2](https://github.com/A-l-y-l-e/Alyle-UI/commit/1f178c2))
* auto contrast ([fc0612c](https://github.com/A-l-y-l-e/Alyle-UI/commit/fc0612c))
* svg ([1147323](https://github.com/A-l-y-l-e/Alyle-UI/commit/1147323))


### Features

* **color:** add auto contrast ([31f177a](https://github.com/A-l-y-l-e/Alyle-UI/commit/31f177a))
* **core:** support for multiple themes ([d8652f2](https://github.com/A-l-y-l-e/Alyle-UI/commit/d8652f2))
* **cropping:** custom background color ([d1bc719](https://github.com/A-l-y-l-e/Alyle-UI/commit/d1bc719))
* **docs:** add docs for auto contrast ([487c10d](https://github.com/A-l-y-l-e/Alyle-UI/commit/487c10d))
* **docs:** add languajes to prism directive ([43928dd](https://github.com/A-l-y-l-e/Alyle-UI/commit/43928dd))
* **docs:** add multiple themes ([992a202](https://github.com/A-l-y-l-e/Alyle-UI/commit/992a202))
* **docs:** update docs ([6a63c4c](https://github.com/A-l-y-l-e/Alyle-UI/commit/6a63c4c))
* **shadow:** add demo-01 ([59a9af7](https://github.com/A-l-y-l-e/Alyle-UI/commit/59a9af7))
* **shadow:** update shadow when necessary ([daea4a1](https://github.com/A-l-y-l-e/Alyle-UI/commit/daea4a1))
* **theme:** add updateRootClass ([cc2d58e](https://github.com/A-l-y-l-e/Alyle-UI/commit/cc2d58e))
* **theme:** Support for custom theme ([bc80734](https://github.com/A-l-y-l-e/Alyle-UI/commit/bc80734))
* **theme:** update styles on change ([82ee1b6](https://github.com/A-l-y-l-e/Alyle-UI/commit/82ee1b6))


### Performance Improvements

* theme ([163cf9a](https://github.com/A-l-y-l-e/Alyle-UI/commit/163cf9a))



