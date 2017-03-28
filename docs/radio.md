## Radio
```html
<ly-radio-group #radio [(ngModel)]="radioVal" color="accent">
  <ly-radio [checked]="true" value="op1">Option 1</ly-radio>
  <ly-radio value="op2">Option 2</ly-radio>
  <ly-radio value="op3">Option 3</ly-radio>
</ly-radio-group>
<ly-radio-group color="primary">
  <ly-radio>Option 1</ly-radio>
  <ly-radio>Option 2</ly-radio>
</ly-radio-group>
<ly-radio-group color="other">
  <ly-radio>Option 1</ly-radio>
  <ly-radio>Option 2</ly-radio>
</ly-radio-group>
<br />
<button ly-button (click)="radioVal = 'op1'">change to 1</button>
<button ly-button (click)="radioVal = 'op2'">change to 2</button>
<button ly-button (click)="radioVal = 'op3'">change to 3</button>
```
