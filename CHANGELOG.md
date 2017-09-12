## CHANGELOG

<a name="1.3.9"></a>
## 1.3.9 (2017-09-10)

### Features
* Update Resizing cropping images
* New demo: icon-button

<a name="1.3.8"></a>
## 1.3.8 (2017-09-07)

### Features
* Update carousel
* New module `LyCoreModule`
  * bg
  * color

<a name="1.3.7"></a>
## 1.3.7 (2017-08-28)

### Features
* Add focus button
* Add BgModule and ColorModule

### Bug Fixes

* fix button
* fix ripple

<a name="1.3.6"></a>
## 1.3.6 (2017-08-18)


### Bug Fixes

* Add native input

<a name="1.3.0"></a>

## 1.3.0 (2017-08-02)

### Features
* Add ResponsiveModule

ts
```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlyleUIModule } from 'alyle-ui';
import { LyButtonModule } from 'alyle-ui/button';
import { ResponsiveModule } from 'alyle-ui/responsive';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    AlyleUIModule.forRoot({
      primary: 'blue',
      accent: 'pink',
      other: 'red',
    }),
    ResponsiveModule,
    LyButtonModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule { }
```

html
```html
<button ly-button *lyResponsive="{'min-width' : '720px'}">button<button>
<button ly-button *lyResponsive="{'max-width' : '720px'}">button<button>
```

### Bug Fixes
* fix export modules

<a name="1.2.0"></a>

## 1.2.0 (2017-07-20)

### Bug Fixes
* fix some errors

## CHANGELOG

<a name="1.1.0"></a>

## 1.1.0 (2017-07-19)

### Bug Fixes
* fix aot compile

<a name="1.0.0"></a>

## 1.0.0 (2017-07-19)

### Bug Fixes
* **button:** fix align
* **tab:** fix view
* **carousel:** fix view
* **ripple:** fix view


<a name="1.0.0-rc.9"></a>

## 1.0.0-rc.9 (2017-06-24)

### Upgrade
* **input:** add default value

```ts
@Component({
  selector: 'input-demo',
  styleUrls: [ './input-demo.component.scss' ],
  template: `
  <h2>Default Input</h2>
  <ly-input type="number" default="123" [(ngModel)]="num1"></ly-input>
  <ly-input type="number" default="321" [(ngModel)]="num2"></ly-input>
  <ly-input default="123" [(ngModel)]="val1"></ly-input>
  <ly-input default="321" [(ngModel)]="val2"></ly-input>
  `
})
export class DemoTheme {
  num1: number;
  num2: number;
  val1: string;
  val2: string;
  constructor() {}
}
```

### Bug Fixes
* **button:** fix view button
* **radio:** fix color theme
* **datepicker:** fix color theme
* **tabs:** fix color theme

<a name="1.0.0-rc.8"></a>

## 1.0.0-rc.8 (2017-06-11)

### Upgrade
* **AlyleUIModule:** All modules were separated.

```js
// Module for the configurations
import { AlyleUIModule } from 'alyle-ui';
// Components
import {
  LyButtonModule,
  LyToolbarModule,
  LyDrawerModule,
  LyCarouselModule,
  LyDatePickerModule,
  LyHeaderPaginationModule,
  LyIconButtonModule,
  LySvgModule,
  LyMenuModule,
  LyTabsModule,
  LyInputModule,
  LyRadioModule,
  LyShadowModule } from 'alyle-ui';

```

### Features
* **LyTheme:** new service.
```js
import { LyTheme } from 'alyle-ui';
@Component({
  selector: 'demo-theme',
  styleUrls: [ './demo-theme.component.scss' ],
  template: `
  <h2 [style.color]="(theme.primary | async)?.color">primary</h2>

  <h2 [style.color]="(theme.accent | async)?.color">accent</h2>

  <h2 [style.color]="(theme.other | async)?.color">other</h2>
  `
})
export class DemoTheme {
  constructor(
    public theme: LyTheme,
  ) {}
}
```

<a name="1.0.0-rc.7"></a>

## 1.0.0-rc.7 (2017-06-01)

### Features

* **ly-button:** introduce `ly-icon-button`.
```html
<button ly-button bg="primary">
  <a ly-icon-button size="18px" class="material-icons">add</a>
  add
</button>
```

## Examples
```html
<!--Text Fiels-->
<ly-input color="accent" [(ngModel)]="name" floatlabel="label" type="text"></ly-input>
<!--Buttons-->
<button ly-button bg="accent" color="#ffffff">button</button>
<button ly-button color="accent" bg="#ffffff" deep="false">button</button>
<!--Tabs-->
<ly-tabs [(selectedIndex)]="index">
  <ly-tab *ngFor="let tab of tabs">
    <!--Label-->
    <ly-tab-label>{{ tab.label }}</ly-tab-label>
    <!--Content-->
    {{ tab.content }}
  </ly-tab>
</ly-tabs>
<!--Icon button-->
<a ly-icon-button size="36px" class="material-icons">check</a>
<a ly-icon-button size="24px" class="material-icons">check</a>
<a ly-icon-button size="18px" class="material-icons">check</a>
<a ly-icon-button><ly-svg src="assets/svg/google.svg"></ly-svg></a>
<a ly-icon-button size="18px"><ly-svg src="assets/svg/google.svg"></ly-svg></a>
<!--Carousel-->
<ly-carousel class="demo-carousel" [interval]="20000">
  <ly-carousel-item [ly-carousel-active]="true" src="assets/img/mountains-863474.jpg">
    content 1
  </ly-carousel-item>
  <ly-carousel-item src="assets/img/img-2355.jpg">
    content 2
  </ly-carousel-item>
</ly-carousel>
<!--[...]-->
```
