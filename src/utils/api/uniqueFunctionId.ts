let currentId = 0;
const map = new WeakMap<object, number>();

export function uniqueFunctionId(func: Function) {
  if (!map.has(func)) map.set(func, ++currentId);

  return `${map.get(func)!.toString()} ${func.name}`;
}
