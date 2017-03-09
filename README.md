# Alyle UI
> ATTENTION: This package is a beta.

Material Design, a package of components for Angular 2

## Install Alyle UI

npm install --save alyle-ui

## Import

#### src/app/app.module.ts

```js
import { AlyleUIModule } from 'alyle-ui';
// other imports 
@NgModule({
  imports: [
    AlyleUIModule.forRoot(),
  ],
  ...
})
export class AppModule { }
```

## Examples
```html
<!--Text Fiels-->
<ly-input color="accent" [(ngModel)]="name" floatlabel="label" type="text"></ly-input>
<!--Buttons-->
<button ly-button bg="accent" color="#ffffff">button</button>
<button ly-button color="accent" bg="#ffffff" deep="false">button</button>
```
