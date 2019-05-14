export function getLyThemeVariableUndefinedError(variable: string) {
  return Error(`Variable '${variable}' undefined in Theme.`);
}

export function getLyThemeVariableOptionUndefinedError(comp: string, variable: string) {
  return Error(`${comp}: variable ${variable} is undefined in Theme.`);
}
