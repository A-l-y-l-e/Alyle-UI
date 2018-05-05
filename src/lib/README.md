# Alyle UI

[![npm](https://img.shields.io/npm/v/@alyle/ui.svg?style=flat-square)](https://npmjs.com/package/alyle-ui)
[![npm](https://img.shields.io/npm/dt/@alyle/ui.svg?style=flat-square)](https://npmjs.com/package/alyle-ui)


## Description

Minimal Design, a package of components for Angular

## Docs

[here](https://alyle-ui.firebaseapp.com/component/button)

## Install Alyle UI

`npm i @alyle/ui -s` or `yarn add @alyle/ui`

## Import

```js
// src/app/app.module.ts

import { AlyleUIModule } from '@alyle/ui';
@NgModule({
  imports: [
    AlyleUIModule.forRoot({
      name: 'default'
    }),
  ],
  ...
})
export class AppModule { }
```

## Components

* button
* carousel
* core
* deep
* drawer
* header pagination
* icon button
* Input
* menu
* radio
* cropping
* ripple
* tabs
* toolbar
