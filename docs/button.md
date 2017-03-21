## Button basic
```html
<p>default</p>
<button ly-button>default</button>
<button ly-button deep="false">default flat</button>
<p>primary</p>
<button ly-button bg="primary" #button1>button</button>
<button ly-button color="primary" #button2>button</button>
<button ly-button color="primary" deep="false" #button3>button</button>
<p>accent</p>
<button ly-button bg="accent">button</button>
<button ly-button color="accent">button</button>
<button ly-button color="accent" deep="false">button</button>
<p>other</p>
<button ly-button bg="other">button</button>
<button ly-button color="other">button</button>
<button ly-button color="other" deep="false">button</button>
<p>link</p>
<a href="#" ly-button bg="primary">button1</a>
<a href="#" ly-button color="primary">button2</a>
<a href="#" ly-button color="primary" deep="false">button3</a>
<p>edit</p>
<button ly-button color="#fff" [bg]="color">button</button>
<button ly-button [color]="color" bg="#fff"
deep="reverse">button</button>
<button ly-button [color]="color" bg="#fff">button</button>
<button ly-button color="#fff" [bg]="color"
(click)="color=(color=='#009688'?'#00bcd4':'#009688')"
[deep]="deep">toggle</button>
<button ly-button [deep]="deep"
(click)="deep=(deep == false ? true : false)">deep: {{ deep }}</button>
<p>disabled</p>
<button ly-button [disabled]="disabled" bg="primary">button</button>
<button ly-button [disabled]="disabled" color="primary">button</button>
<button ly-button [disabled]="disabled" color="primary" deep="false">button</button>
<button ly-button (click)="disabled=disabled==true?false:true"
color="primary" deep="false">disable: {{ disabled }}</button>
```
