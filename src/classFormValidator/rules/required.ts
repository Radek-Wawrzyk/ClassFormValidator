export function requiredRule(value:string):boolean {
  return value.trim().length === 0;
}