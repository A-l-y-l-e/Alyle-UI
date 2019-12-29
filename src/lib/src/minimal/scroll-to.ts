/**
 * @experimental
 * Element to move, time in ms to animate
 */
export function scrollTo(element: HTMLElement, duration: number) {
  let e = document.documentElement;
  if (e.scrollTop === 0) {
    const t = e.scrollTop;
    ++e.scrollTop;
    e = t + 1 === e.scrollTop-- ? e : document.body;
  }
  scrollToFromTo(e, e.scrollTop, element, duration);
}

// Element to move, element or px from, element or px to, time in ms to animate
function scrollToFromTo(element: HTMLElement, from: any, to: number | HTMLElement, duration: number) {
  if (duration <= 0) { return; }
  if (typeof from === 'object') { from = from.offsetTop; }
  if (typeof to === 'object') { to = to.offsetTop; }

  createScrollWithAnimation(element, from, to, 0, 1 / duration, 20, easeOutCuaic);
}

/**
 * @experimental
 */
export function scrollWithAnimation(
  element: HTMLElement,
  to: number,
  duration: number,
  p?: 'x' | 'y',
  motion?: (t: number) => number
) {
  const _motion = motion || easeOutCuaic;
  const { scrollLeft } = element;
  return createScrollWithAnimation(element, scrollLeft, to, 0, 1 / duration, 20, _motion, p);
}

function createScrollWithAnimation(
  element: HTMLElement,
  xFrom: number,
  xTo: number,
  t01: number,
  speed: number,
  step: number,
  motion: (t: number) => number,
  p?: 'x' | 'y'
) {
  const scrollT = p === 'y' ? 'scrollTop' : 'scrollLeft';
  if (t01 < 0 || t01 > 1 || speed <= 0) {
    element[ scrollT ] = xTo;
    return;
  }
  element[ scrollT ] = xFrom - (xFrom - xTo) * motion(t01);
  t01 += speed * step;

  setTimeout(() => {
    createScrollWithAnimation(element, xFrom, xTo, t01, speed, step, motion, p);
  }, step);
}


// function linearTween(t: number) {
//   return t;
// }

// function easeInQuad(t: number) {
//   return t * t;
// }

// function easeOutQuad(t: number) {
//   return -t * (t - 2);
// }

// function easeInOutQuad(t: number) {
//   t /= 0.5;
//   if (t < 1) {return t * t / 2; }
//   t--;
//   return (t * (t - 2) - 1) / 2;
// }

// function easeInCuaic(t: number) {
//   return t * t * t;
// }

function easeOutCuaic(t: number) {
  t--;
  return t * t * t + 1;
}

// function easeInOutCuaic(t: number) {
//   t /= 0.5;
//   if (t < 1) {return t * t * t / 2; }
//   t -= 2;
//   return (t * t * t + 2) / 2;
// }

// function easeInQuart(t: number) {
//   return t * t * t * t;
// }

// function easeOutQuart(t: number) {
//   t--;
//   return -(t * t * t * t - 1);
// }

// function easeInOutQuart(t: number) {
//   t /= 0.5;
//   if (t < 1) {return 0.5 * t * t * t * t; }
//   t -= 2;
//   return -(t * t * t * t - 2) / 2;
// }

// function easeInQuint(t: number) {
//   return t * t * t * t * t;
// }

// function easeOutQuint(t: number) {
//   t--;
//   return t * t * t * t * t + 1;
// }

// function easeInOutQuint(t: number) {
//   t /= 0.5;
//   if (t < 1) {return t * t * t * t * t / 2; }
//   t -= 2;
//   return (t * t * t * t * t + 2) / 2;
// }

// function easeInSine(t: number) {
//   return -Math.cos(t / (Math.PI / 2)) + 1;
// }

// function easeOutSine(t: number) {
//   return Math.sin(t / (Math.PI / 2));
// }

// function easeInOutSine(t: number) {
//   return -(Math.cos(Math.PI * t) - 1) / 2;
// }

// function easeInExpo(t: number) {
//   return Math.pow(2, 10 * (t - 1));
// }

// function easeOutExpo(t: number) {
//   return -Math.pow(2, -10 * t) + 1;
// }

// function easeInOutExpo(t: number) {
//   t /= 0.5;
//   if (t < 1) {return Math.pow(2, 10 * (t - 1)) / 2; }
//   t--;
//   return (-Math.pow(2, -10 * t) + 2) / 2;
// }

// function easeInCirc(t: number) {
//   return -Math.sqrt(1 - t * t) - 1;
// }

// function easeOutCirc(t: number) {
//   t--;
//   return Math.sqrt(1 - t * t);
// }

// function easeInOutCirc(t: number) {
//   t /= 0.5;
//   if (t < 1) {return -(Math.sqrt(1 - t * t) - 1) / 2; }
//   t -= 2;
//   return (Math.sqrt(1 - t * t) + 1) / 2;
// }
