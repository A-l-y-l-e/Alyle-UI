export function getLyThemeVariableUndefinedError(variable: string) {
  return Error(`Variable '${variable}' undefined in Theme.`);
}

export function getLyThemeVariableOptionUndefinedError(comp: string, variable: string) {
  return Error(`${comp}: variable ${variable} is undefined in Theme.`);
}
export function getLyThemeStyleUndefinedError(comp: string, input: string, val: string) {
  return Error(`${comp}: no styles defined in the theme have been found for \`@Input() ${input}\`,`
    + ` the value given is \`${val}\`.`);
}
