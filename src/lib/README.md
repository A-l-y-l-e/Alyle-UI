# Alyle UI

[![npm](https://img.shields.io/npm/v/alyle-ui.svg?style=flat-square)]()
[![npm](https://img.shields.io/npm/dt/alyle-ui.svg?style=flat-square)]()
[![Dependency Status](https://david-dm.org/A-l-y-l-e/alyle-ui.svg?style=flat-square)](https://david-dm.org/A-l-y-l-e/alyle-ui)

[![NPM](https://nodei.co/npm/alyle-ui.png?compact=true)](https://nodei.co/npm/alyle-ui?style=flat-square)

## Description

Minimal Design, a package of components for Angular

## Docs

[here](https://alyle-ui.firebaseapp.com/components/button)

## Install Alyle UI

npm install alyle-ui --save

## Import

### src/app/app.module.ts

```js
import { AlyleUIModule } from 'alyle-ui';
@NgModule({
  imports: [
    AlyleUIModule.forRoot({
      primary: 'blue',
      accent: 'pink',
      other: 'red',
      palette: {
        'blue': {
          '500': '#2196F3',
          contrast: 'light'
        },
        'pink': {
          '500': '#ff4b73',
          contrast: 'light'
        },
        'red': {
          '500': '#FF5252',
          contrast: 'light'
        }
      }
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
* date picker
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
* upload files *(beta)*
