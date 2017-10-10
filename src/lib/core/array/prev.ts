export function Ly_Prev(value: any[], index: number): any {
  let nxt: any[] = value;
  let i: number = index;
  let length: number = nxt.length;
  let _index: any;
  if ((i - 1) <= 0 || (i - 1) >= length - 1) {
    nxt = (nxt[(nxt.length - 1)]);
    _index = (nxt.length - 1);
  } else if (i === 0) {
    nxt = (nxt[(0)]);
    _index = (0);
  } else {
    nxt = (nxt[(i - 1)]);
    _index = (i - 1);
  }
  return {
    index: _index,
    prev: nxt,
  };
}
