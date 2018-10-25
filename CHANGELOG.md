<a name="1.7.4"></a>
## [1.7.4](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.3...1.7.4) (2018-10-25)


### Features

* **core:** support to use more of '&' in multiple styles ([fc2cb75](https://github.com/A-l-y-l-e/Alyle-UI/commit/fc2cb75))
* **img-cropper:** improve img copper ([#61](https://github.com/A-l-y-l-e/Alyle-UI/issues/61)) ([f9ad2c0](https://github.com/A-l-y-l-e/Alyle-UI/commit/f9ad2c0))



<a name="1.7.3"></a>
## [1.7.3](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.2...1.7.3) (2018-10-20)


### Features

* **core:** support to create multiple styles without key ([#59](https://github.com/A-l-y-l-e/Alyle-UI/issues/59)) ([246e4fb](https://github.com/A-l-y-l-e/Alyle-UI/commit/246e4fb))
* **field:** add description ([9b9f7d1](https://github.com/A-l-y-l-e/Alyle-UI/commit/9b9f7d1))



<a name="1.7.2"></a>
## [1.7.2](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.1...1.7.2) (2018-10-18)


### Bug Fixes

* **grid:** add [@ignore](https://github.com/ignore) tag for COL_VALUES ([38d6fc4](https://github.com/A-l-y-l-e/Alyle-UI/commit/38d6fc4))
* **grid:** fix type aliases ([4143473](https://github.com/A-l-y-l-e/Alyle-UI/commit/4143473))


### Features

* **button:** add disableRipple property ([0c80b69](https://github.com/A-l-y-l-e/Alyle-UI/commit/0c80b69))



<a name="1.7.1"></a>
## [1.7.1](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0...1.7.1) (2018-10-14)


### Bug Fixes

* **field:** fix align infix ([e02be6c](https://github.com/A-l-y-l-e/Alyle-UI/commit/e02be6c))
* **radio:** fix styles ([d2c76cd](https://github.com/A-l-y-l-e/Alyle-UI/commit/d2c76cd))



<a name="1.7.0"></a>
# [1.7.0](https://github.com/A-l-y-l-e/Alyle-UI/compare/v1.7.3...1.7.0) (2018-10-13)


### Bug Fixes

* **field:** add prefix, suffix & hint ([136b13b](https://github.com/A-l-y-l-e/Alyle-UI/commit/136b13b))
* **field:** fix align ([4ae2524](https://github.com/A-l-y-l-e/Alyle-UI/commit/4ae2524))
* **field:** fix appearance ([75d64aa](https://github.com/A-l-y-l-e/Alyle-UI/commit/75d64aa))
* **field:** fix bg filled in mode dark ([7c085f2](https://github.com/A-l-y-l-e/Alyle-UI/commit/7c085f2))
* **field:** fix max width label ([ab7188f](https://github.com/A-l-y-l-e/Alyle-UI/commit/ab7188f))
* **field:** fix placeholder ([1523b19](https://github.com/A-l-y-l-e/Alyle-UI/commit/1523b19))
* **field:** fix position placeholder ([ac0e7df](https://github.com/A-l-y-l-e/Alyle-UI/commit/ac0e7df))
* **field:** fix styles for textarea with rows ([e0cb704](https://github.com/A-l-y-l-e/Alyle-UI/commit/e0cb704))
* **field:** fix textarea ([c29611b](https://github.com/A-l-y-l-e/Alyle-UI/commit/c29611b))
* **field:** fix theme ([8542964](https://github.com/A-l-y-l-e/Alyle-UI/commit/8542964))
* **field:** fix variables ([b37f2a5](https://github.com/A-l-y-l-e/Alyle-UI/commit/b37f2a5))
* **field:** fix withColor ([2d92f6b](https://github.com/A-l-y-l-e/Alyle-UI/commit/2d92f6b))
* **field:** update styles ([bd43014](https://github.com/A-l-y-l-e/Alyle-UI/commit/bd43014))


### Features

* **core:** add mutation observer ([a9ff395](https://github.com/A-l-y-l-e/Alyle-UI/commit/a9ff395))
* **field:**  add styles for input native ([d29e7a1](https://github.com/A-l-y-l-e/Alyle-UI/commit/d29e7a1))
* **field:** add caretColor ([d49472d](https://github.com/A-l-y-l-e/Alyle-UI/commit/d49472d))
* **field:** add filled type ([3392520](https://github.com/A-l-y-l-e/Alyle-UI/commit/3392520))
* **field:** add outlined type ([ad3feee](https://github.com/A-l-y-l-e/Alyle-UI/commit/ad3feee))
* **field:** add standard field ([4466623](https://github.com/A-l-y-l-e/Alyle-UI/commit/4466623))
* **field:** initial commit for field ([3a0cdff](https://github.com/A-l-y-l-e/Alyle-UI/commit/3a0cdff))


<a name="1.7.0-beta.76gq3"></a>
# [1.7.0-beta.76gq3](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.75cav...1.7.0-beta.76gq3) (2018-10-01)


### Bug Fixes

* **drawer:** add transitionProperty ([186c63f](https://github.com/A-l-y-l-e/Alyle-UI/commit/186c63f))


### Features

* **core:** update core to apply the customizable theme easily ([0ccfabe](https://github.com/A-l-y-l-e/Alyle-UI/commit/0ccfabe))


### BREAKING CHANGES

* **core:** Set theme

before:
```ts
/** Add theme */
export class MyCustomTheme implements LyThemeConfig {
  themes = [CustomMinimaLight, CustomMinimaDark];
  /** overwrite for light & dark */
  variables = new GlobalVariables;
}

@NgModule({
  provides: [
    { provide: LY_THEME_CONFIG, useClass: MyCustomTheme }
  ]
  ...
})

```

after:
```ts
@NgModule({
  ...
  imports: [
    LyThemeModule.setTheme('minima-dark')
  ],
  provides: [
    ...
    { provide: LY_THEME, useClass: CustomMinimaLight, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaDark, multi: true },
    { provide: LY_THEME_GLOBAL_VARIABLES, useClass: GlobalVariables } // global variables, overwrite for light & dark
  ]
```



<a name="1.7.0-beta.75cav"></a>
# [1.7.0-beta.75cav](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.73atw...1.7.0-beta.75cav) (2018-10-01)


### Bug Fixes

* **badge:** fix position ([200baba](https://github.com/A-l-y-l-e/Alyle-UI/commit/200baba))
* **button:** use ripple styles ([319a661](https://github.com/A-l-y-l-e/Alyle-UI/commit/319a661))
* **core:** add style priority ([881ec78](https://github.com/A-l-y-l-e/Alyle-UI/commit/881ec78))
* **drawer:** fix animation when toggle drawer ([9142a14](https://github.com/A-l-y-l-e/Alyle-UI/commit/9142a14))
* **drawer:** remove text content in template backdrop ([f574b28](https://github.com/A-l-y-l-e/Alyle-UI/commit/f574b28))
* **icon-button:** fix overflow style ([a0dc7c2](https://github.com/A-l-y-l-e/Alyle-UI/commit/a0dc7c2))
* **icon-button:** remove overflow style ([5e00c54](https://github.com/A-l-y-l-e/Alyle-UI/commit/5e00c54))


### Features

* **badge:** initial commit for badge ([a17683d](https://github.com/A-l-y-l-e/Alyle-UI/commit/a17683d))
* **ripple:** add container style ([ead9a3d](https://github.com/A-l-y-l-e/Alyle-UI/commit/ead9a3d))
* **ripple:** add ripple variables ([ee59488](https://github.com/A-l-y-l-e/Alyle-UI/commit/ee59488))
* **theme:** add animations to variables ([d21961d](https://github.com/A-l-y-l-e/Alyle-UI/commit/d21961d))



<a name="1.7.0-beta.73atw"></a>
# [1.7.0-beta.73atw](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.6gxhn...1.7.0-beta.73atw) (2018-09-30)


### Bug Fixes

* **button:** fix overflow ([2478ccc](https://github.com/A-l-y-l-e/Alyle-UI/commit/2478ccc))
* **core:** do not update classname when it is equal to the new ([56aeec7](https://github.com/A-l-y-l-e/Alyle-UI/commit/56aeec7))
* **core:** do not update classname when it is equal to the new ([68ef173](https://github.com/A-l-y-l-e/Alyle-UI/commit/68ef173))
* **drawer:** fix drawer over ([32e984d](https://github.com/A-l-y-l-e/Alyle-UI/commit/32e984d))
* **drawer:** fix responsive drawer ([166d8ff](https://github.com/A-l-y-l-e/Alyle-UI/commit/166d8ff))
* **drawer:** fix styles ([ee4351f](https://github.com/A-l-y-l-e/Alyle-UI/commit/ee4351f))
* **drawer:** fix toggle drawer ([74c82a9](https://github.com/A-l-y-l-e/Alyle-UI/commit/74c82a9))
* **drawer:** force mode over ([8cb715d](https://github.com/A-l-y-l-e/Alyle-UI/commit/8cb715d))
* **image-cropper:** update gesture config ([9d3814c](https://github.com/A-l-y-l-e/Alyle-UI/commit/9d3814c))
* **responsive:** remove unused files ([b6dc6e5](https://github.com/A-l-y-l-e/Alyle-UI/commit/b6dc6e5))
* **responsive:** remove unused variables ([4d23dea](https://github.com/A-l-y-l-e/Alyle-UI/commit/4d23dea))
* **ripple:** fix trigger element ([c00e49b](https://github.com/A-l-y-l-e/Alyle-UI/commit/c00e49b))
* fix gesture config ([38d6dfa](https://github.com/A-l-y-l-e/Alyle-UI/commit/38d6dfa))
* remove deprecated method ([8dd555c](https://github.com/A-l-y-l-e/Alyle-UI/commit/8dd555c))
* **ripple:** fix trigger element container ([5f5d4a3](https://github.com/A-l-y-l-e/Alyle-UI/commit/5f5d4a3))
* **ripple:** remove unused styles ([8897d89](https://github.com/A-l-y-l-e/Alyle-UI/commit/8897d89))
* **theme:** fix add zIndex ([3a55727](https://github.com/A-l-y-l-e/Alyle-UI/commit/3a55727))
* **toolbar:** fix zIndex ([f7e6a59](https://github.com/A-l-y-l-e/Alyle-UI/commit/f7e6a59))


### Features

* **drawer:** add responsive drawer ([363ceec](https://github.com/A-l-y-l-e/Alyle-UI/commit/363ceec))
* add direction property optional ([f3e8e7e](https://github.com/A-l-y-l-e/Alyle-UI/commit/f3e8e7e))



<a name="1.7.0-beta.6gxhn"></a>
# [1.7.0-beta.6gxhn](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.6d2nq...1.7.0-beta.6gxhn) (2018-09-18)


### Bug Fixes

* **core:** 'fontFamily' does not exist on type in theme.typography ([759be9b](https://github.com/A-l-y-l-e/Alyle-UI/commit/759be9b))
* fix typography variables ([403588c](https://github.com/A-l-y-l-e/Alyle-UI/commit/403588c))
* **toolbar:** fix cannot determine the module for class ToolbarItem ([3b37b3c](https://github.com/A-l-y-l-e/Alyle-UI/commit/3b37b3c))
* **toolbar:** fix position on new value ([3a0d23b](https://github.com/A-l-y-l-e/Alyle-UI/commit/3a0d23b))
* **toolbar:** set default bg ([8eb1696](https://github.com/A-l-y-l-e/Alyle-UI/commit/8eb1696))


### Features

* **toolbar:** add the ability to position the toolbar ([baee37d](https://github.com/A-l-y-l-e/Alyle-UI/commit/baee37d))



<a name="1.7.0-beta.6d2nq"></a>
# [1.7.0-beta.6d2nq](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.6b7cf...1.7.0-beta.6d2nq) (2018-09-15)


### Bug Fixes

* **button:** add style priority ([2d9ee24](https://github.com/A-l-y-l-e/Alyle-UI/commit/2d9ee24))
* **button:** fix style priority ([9d30d48](https://github.com/A-l-y-l-e/Alyle-UI/commit/9d30d48))
* **card:** add style priority ([ac91210](https://github.com/A-l-y-l-e/Alyle-UI/commit/ac91210))
* **card:** fix style priority ([f6b0e1e](https://github.com/A-l-y-l-e/Alyle-UI/commit/f6b0e1e))
* **carousel:** add style priority ([3fee681](https://github.com/A-l-y-l-e/Alyle-UI/commit/3fee681))
* **carousel:** fix style priority ([83be366](https://github.com/A-l-y-l-e/Alyle-UI/commit/83be366))
* **carousel:** remove unused style ([95eccbd](https://github.com/A-l-y-l-e/Alyle-UI/commit/95eccbd))
* **grid:** add style priority ([f7adf01](https://github.com/A-l-y-l-e/Alyle-UI/commit/f7adf01))
* **grid:** fix style priority ([e5a3de4](https://github.com/A-l-y-l-e/Alyle-UI/commit/e5a3de4))
* **icon:** fix style priority ([a8dd08e](https://github.com/A-l-y-l-e/Alyle-UI/commit/a8dd08e))
* **icon:** set style priority ([e4ea510](https://github.com/A-l-y-l-e/Alyle-UI/commit/e4ea510))
* **icon-button:** fix style priority ([9415b18](https://github.com/A-l-y-l-e/Alyle-UI/commit/9415b18))
* **icon-button:** set style priority ([5076b4f](https://github.com/A-l-y-l-e/Alyle-UI/commit/5076b4f))
* **menu:** remove LyMenuDeprecated ([452b0d5](https://github.com/A-l-y-l-e/Alyle-UI/commit/452b0d5))
* **menu:** remove unused styles ([b5088a7](https://github.com/A-l-y-l-e/Alyle-UI/commit/b5088a7))
* **radio:** set style priority ([b312a8e](https://github.com/A-l-y-l-e/Alyle-UI/commit/b312a8e))
* **toolbar:** update styles & set style priority ([758f5b3](https://github.com/A-l-y-l-e/Alyle-UI/commit/758f5b3))
* **typography:** set style priority ([9a59d3e](https://github.com/A-l-y-l-e/Alyle-UI/commit/9a59d3e))


### Features

* **image-cropper:** update styles & set style priority ([44dd2fa](https://github.com/A-l-y-l-e/Alyle-UI/commit/44dd2fa))



<a name="1.7.0-beta.6b7cf"></a>
# [1.7.0-beta.6b7cf](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.63q2l...1.7.0-beta.6b7cf) (2018-09-14)


### Bug Fixes

* **card:** fix responsive ([146d959](https://github.com/A-l-y-l-e/Alyle-UI/commit/146d959))
* **theme:** move breakpoints in theme ([28e8d42](https://github.com/A-l-y-l-e/Alyle-UI/commit/28e8d42))


### Features

* **card:** responsive ([bae0923](https://github.com/A-l-y-l-e/Alyle-UI/commit/bae0923))
* **core:** add shadow property for PaletteColor ([71cb45f](https://github.com/A-l-y-l-e/Alyle-UI/commit/71cb45f))
* **core:** fix global variables ([6f95433](https://github.com/A-l-y-l-e/Alyle-UI/commit/6f95433))
* **core:** option for add optional global variables change theme ([a20a270](https://github.com/A-l-y-l-e/Alyle-UI/commit/a20a270))
* create property breakpoints in ThemeVariables ([4529fa3](https://github.com/A-l-y-l-e/Alyle-UI/commit/4529fa3))



<a name="1.7.0-beta.63q2l"></a>
# [1.7.0-beta.63q2l](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.603x9...1.7.0-beta.63q2l) (2018-09-10)


### Bug Fixes

* **grid:** rename `LyGridCol` to `LyGridItem` ([1a80a0a](https://github.com/A-l-y-l-e/Alyle-UI/commit/1a80a0a))


### Features

* **grid:** add order option ([2803457](https://github.com/A-l-y-l-e/Alyle-UI/commit/2803457))



<a name="1.7.0-beta.603x9"></a>
# [1.7.0-beta.603x9](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.5rfx4...1.7.0-beta.603x9) (2018-09-08)


### Bug Fixes

* **core:** remove unused variables ([5d2922b](https://github.com/A-l-y-l-e/Alyle-UI/commit/5d2922b))
* **docs:** add button Stackblitz ([188f3a4](https://github.com/A-l-y-l-e/Alyle-UI/commit/188f3a4))



<a name="1.7.0-beta.5rfx4"></a>
# [1.7.0-beta.5rfx4](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.5k53n...1.7.0-beta.5rfx4) (2018-09-04)


### Features

* **menu:** support lazy loading ([36b3b13](https://github.com/A-l-y-l-e/Alyle-UI/commit/36b3b13))
* **menu:** update position on scroll ([d696fc9](https://github.com/A-l-y-l-e/Alyle-UI/commit/d696fc9))



<a name="1.7.0-beta.5k53n"></a>
# [1.7.0-beta.5k53n](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.5hkh9...1.7.0-beta.5k53n) (2018-08-31)


### Features

* **grid:** add `direction` & `justify` ([b9a331d](https://github.com/A-l-y-l-e/Alyle-UI/commit/b9a331d))



<a name="1.7.0-beta.5hkh9"></a>
# [1.7.0-beta.5hkh9](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.5hie9...1.7.0-beta.5hkh9) (2018-08-29)


### Bug Fixes

* **icon:** fix icon default class ([2ec8488](https://github.com/A-l-y-l-e/Alyle-UI/commit/2ec8488))



<a name="1.7.0-beta.5hie9"></a>
# [1.7.0-beta.5hie9](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.5gg5p...1.7.0-beta.5hie9) (2018-08-29)


### Bug Fixes

* **core:** fix styles in ssr ([b9b6fde](https://github.com/A-l-y-l-e/Alyle-UI/commit/b9b6fde))



<a name="1.7.0-beta.5gg5p"></a>
# [1.7.0-beta.5gg5p](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.5gch8...1.7.0-beta.5gg5p) (2018-08-29)


### Bug Fixes

* **core:** Failed to execute 'insertBefore' on 'Node'... ([cb3cab2](https://github.com/A-l-y-l-e/Alyle-UI/commit/cb3cab2))



<a name="1.7.0-beta.5gch8"></a>
# [1.7.0-beta.5gch8](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.54p91...1.7.0-beta.5gch8) (2018-08-29)


### Bug Fixes

* **card:** update styles ([55bc854](https://github.com/A-l-y-l-e/Alyle-UI/commit/55bc854))
* **carousel:** remove unused variables ([c2b7495](https://github.com/A-l-y-l-e/Alyle-UI/commit/c2b7495))
* **carousel:** update styles ([ad6bc02](https://github.com/A-l-y-l-e/Alyle-UI/commit/ad6bc02))
* **carousel:** update styles ([0602a02](https://github.com/A-l-y-l-e/Alyle-UI/commit/0602a02))
* **core:** fix ssr ([20394eb](https://github.com/A-l-y-l-e/Alyle-UI/commit/20394eb))
* **core:** remove unused style container ([5c193f3](https://github.com/A-l-y-l-e/Alyle-UI/commit/5c193f3))
* **core:** update styles ([10f19a7](https://github.com/A-l-y-l-e/Alyle-UI/commit/10f19a7))
* **grid:** move grid `@alyle/ui/layout` to `@alyle/ui/grid` ([3797aa0](https://github.com/A-l-y-l-e/Alyle-UI/commit/3797aa0))
* remove unused files ([1506267](https://github.com/A-l-y-l-e/Alyle-UI/commit/1506267))
* **icon:** update styles ([5ec2ef1](https://github.com/A-l-y-l-e/Alyle-UI/commit/5ec2ef1))
* **icon-button:** update styles ([a338cea](https://github.com/A-l-y-l-e/Alyle-UI/commit/a338cea))
* **input:** update styles ([1714ff1](https://github.com/A-l-y-l-e/Alyle-UI/commit/1714ff1))
* **radio:** remove unused variables ([6339fbf](https://github.com/A-l-y-l-e/Alyle-UI/commit/6339fbf))
* **radio:** update styles ([4fb7e22](https://github.com/A-l-y-l-e/Alyle-UI/commit/4fb7e22))


### Features

* **responsive:** update styles ([783f3b7](https://github.com/A-l-y-l-e/Alyle-UI/commit/783f3b7))
* **tabs:** add ripple for tabs ([94378f9](https://github.com/A-l-y-l-e/Alyle-UI/commit/94378f9))


### BREAKING CHANGES

* **grid:** new grid ultra responsive `@alyle/ui/grid`

With `@alyle/ui/layout`

`@alyle/ui/layout` deprecated

before:
```html
<grid [gutter]="16">
  <grid [col]="'6 12@XSmall'">
    <p>col=6</p>
  </grid>
  <grid [col]="'6 12@XSmall'">
    <p>col=6</p>
  </grid>
</grid>
```

Import `@alyle/ui/grid`

after:
```html
<ly-grid container [spacing]="16 8@XSmall">
  <ly-grid item [col]="'6 12@XSmall'">
    <p>col=12</p>
  </ly-grid>
  <ly-grid item [col]="'6 12@XSmall'">
    <p>col=12</p>
  </ly-grid>
</ly-grid>
```



<a name="1.7.0-beta.54p91"></a>
# [1.7.0-beta.54p91](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.50yre...1.7.0-beta.54p91) (2018-08-22)


### Bug Fixes

* **core:** `addStyleSheet` return named object of the classes ([7478a33](https://github.com/A-l-y-l-e/Alyle-UI/commit/7478a33))


### Features

* **core:** add option for global style ([5cdf290](https://github.com/A-l-y-l-e/Alyle-UI/commit/5cdf290))



<a name="1.7.0-beta.50yre"></a>
# [1.7.0-beta.50yre](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.4u2xw...1.7.0-beta.50yre) (2018-08-20)


### Bug Fixes

* **theme:** fix `setTheme` multiples themes ([8814f9e](https://github.com/A-l-y-l-e/Alyle-UI/commit/8814f9e))
* **theme:** fix `setTheme` not working ([bafa607](https://github.com/A-l-y-l-e/Alyle-UI/commit/bafa607))
* **theme:** fix multiples themes ([093f6de](https://github.com/A-l-y-l-e/Alyle-UI/commit/093f6de))
* **theme:** get className in `devMode()` ([2b6d25e](https://github.com/A-l-y-l-e/Alyle-UI/commit/2b6d25e))


### Features

* **core:** add `colorOf` to `LyStyleUtils` ([9bc08c9](https://github.com/A-l-y-l-e/Alyle-UI/commit/9bc08c9))


### Performance Improvements

* **button:** update styles ([8efee2b](https://github.com/A-l-y-l-e/Alyle-UI/commit/8efee2b))



<a name="1.7.0-beta.4u2xw"></a>
# [1.7.0-beta.4u2xw](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.4imhk...1.7.0-beta.4u2xw) (2018-08-17)


### Bug Fixes

* **button:** change classses to public ([678e0e8](https://github.com/A-l-y-l-e/Alyle-UI/commit/678e0e8))
* **theme:** rename `styleName` to `withClass` directive ([f9f1c79](https://github.com/A-l-y-l-e/Alyle-UI/commit/f9f1c79))
* **theme:** rename MinimaThemeModule to ThemeMinimaModule ([ab2e2f4](https://github.com/A-l-y-l-e/Alyle-UI/commit/ab2e2f4))
* **theme:** update interface for Style ([397653e](https://github.com/A-l-y-l-e/Alyle-UI/commit/397653e))


### Features

* **button:** update button with `addStyleSheet` ([e5c9e33](https://github.com/A-l-y-l-e/Alyle-UI/commit/e5c9e33))
* **tabs:** add `selectedIndexOnChange` for tabs ([865d45a](https://github.com/A-l-y-l-e/Alyle-UI/commit/865d45a))
* **tabs:** support tabs with async ([dc08d0e](https://github.com/A-l-y-l-e/Alyle-UI/commit/dc08d0e))
* **theme:** add `withClass` directive ([fba487f](https://github.com/A-l-y-l-e/Alyle-UI/commit/fba487f))
* **theme:** add styleName directive ([0542d4b](https://github.com/A-l-y-l-e/Alyle-UI/commit/0542d4b))
* **theme:** converter className id number to string with radix 36 ([f5e5346](https://github.com/A-l-y-l-e/Alyle-UI/commit/f5e5346))


### Performance Improvements

* **theme:** cache style ([ecf26d5](https://github.com/A-l-y-l-e/Alyle-UI/commit/ecf26d5))
* **theme:** now `addStyle` works with CLASSES_MAP ([a77a7e2](https://github.com/A-l-y-l-e/Alyle-UI/commit/a77a7e2))



<a name="1.7.0-beta.4imhk"></a>
# [1.7.0-beta.4imhk](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.4iic8...1.7.0-beta.4imhk) (2018-08-11)


### Bug Fixes

* **theme:** fix types ([beb2c9b](https://github.com/A-l-y-l-e/Alyle-UI/commit/beb2c9b))



<a name="1.7.0-beta.4iic8"></a>
# [1.7.0-beta.4iic8](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.4ih8i...1.7.0-beta.4iic8) (2018-08-10)


### Bug Fixes

* **button:** fix sizes ([f0e1716](https://github.com/A-l-y-l-e/Alyle-UI/commit/f0e1716))
* **theme:** fix circular dependency ([ecc90e9](https://github.com/A-l-y-l-e/Alyle-UI/commit/ecc90e9))


### Features

* **theme:** add Dynamic styles ([09f9de8](https://github.com/A-l-y-l-e/Alyle-UI/commit/09f9de8))



<a name="1.7.0-beta.4bkua"></a>
# [1.7.0-beta.4bkua](https://github.com/A-l-y-l-e/Alyle-UI/compare/1.7.0-beta.461kq...1.7.0-beta.4bkua) (2018-08-07)


### Bug Fixes

* fix imports ([1de7e2d](https://github.com/A-l-y-l-e/Alyle-UI/commit/1de7e2d))
* **tabs:** change min-width to 72 ([f994a13](https://github.com/A-l-y-l-e/Alyle-UI/commit/f994a13))
* **tabs:** fix animations ([a02811b](https://github.com/A-l-y-l-e/Alyle-UI/commit/a02811b))
* **tabs:** fix color ([e4c946e](https://github.com/A-l-y-l-e/Alyle-UI/commit/e4c946e))
* **tabs:** fix indicator ([70157ea](https://github.com/A-l-y-l-e/Alyle-UI/commit/70157ea))
* **theme:** clean styles in browser ([942d270](https://github.com/A-l-y-l-e/Alyle-UI/commit/942d270))



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



