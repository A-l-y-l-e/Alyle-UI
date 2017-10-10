export function TimeOut( milliseconds: number = 0 ) {

  return function( target: any, key: any, descriptor: any ) {

    var originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {

      setTimeout(() => {
        originalMethod.apply(this, args);
       }, milliseconds);

    };

    return descriptor;
  }

}
export function Interval( milliseconds: number = 0 ) {

  return function( target: any, key: any, descriptor: any ) {

    var originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {

      setInterval(() => {
        originalMethod.apply(this, args);
       }, milliseconds);

    };

    return descriptor;
  }

}
