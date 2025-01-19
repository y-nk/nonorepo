// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_get
export function get<T>(obj: object, path: string, defaultValue?: T) {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj,
      );

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);

  return result === undefined || result === obj ? defaultValue : result;
}
