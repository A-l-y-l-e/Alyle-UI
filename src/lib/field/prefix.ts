import {Directive} from '@angular/core';


/** Prefix to be placed the before of the field. */
@Directive({
  selector: '[lyPrefix]',
  standalone: false
})
export class LyPrefix {}
