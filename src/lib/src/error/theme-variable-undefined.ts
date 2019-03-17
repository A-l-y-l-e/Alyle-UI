export function getLyThemeVariableUndefinedError(variable: string) {
  return Error(`Variable '${variable}' undefined in Theme.`);
}
