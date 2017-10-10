export function getParents(el: HTMLElement, parentSelector: string) {

  // If no parentSelector defined will bubble up all the way to *document*
  if (parentSelector === undefined) {
      parentSelector = 'body';
  }

  let parents: Array<any> = [];
  let p: any = el.parentNode;
  let pxz: HTMLElement = null;
  while (!pxz) {
      let o = p;
      parents.push(o);
      p = o.parentNode;
      pxz = p.querySelector(parentSelector);
  }
  // parents.push(_parentSelector); // Push that parentSelector you wanted to stop at
  // console.log(parents[parents.length - 1]);
  return parents[parents.length - 1];
}
