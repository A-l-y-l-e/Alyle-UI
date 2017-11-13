export function toBoolean(value: any) {
  return value != null && `${value}` !== 'false';
}
export function IsBoolean(): any {
  return (target: any, key: any) => {
    let data;
    Object.defineProperty(target, key, {
      configurable: false,
      set: (value) => {
        data = toBoolean(value);
        return data;
      },
      get: () => data,
    });
  };
}
