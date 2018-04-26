export function Ly_Next(value: any, index: any) {
  let nxt: any = value;
  const i: any = index;
  const length: any = nxt.length;
  let _index: any;

  // let part = index / length;
  if ((i + 1) < length ) {
    nxt = (nxt[(i + 1)]);
    _index = i + 1;
  } else {
    _index = 0;
    nxt = (nxt[(0)]);
  }
  return {
    index: _index,
    next: nxt,
  };
}
