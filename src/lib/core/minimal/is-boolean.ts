export function toBoolean(value: any) {
  return value != null && `${value}` !== 'false';
}
export function IsBoolean(): PropertyDecorator {
  return (target: Object, key: string) => {
    const definition = Object.getOwnPropertyDescriptor(target, key);
    if (definition) {
      Object.defineProperty(target, key, {
        get: definition.get,
        set: newValue => {
          definition.set(toBoolean(newValue));
        },
        enumerable: true,
        configurable: true
      });
    } else {
      Object.defineProperty(target, key, {
        get: function () {
          return this['__' + key];
        },
        set: function (newValue) {
          this['__' + key] = toBoolean(newValue);
        },
        enumerable: true,
        configurable: true
      });
    }
  };
}
