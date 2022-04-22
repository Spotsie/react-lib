interface Entity {
  id: number;
}

export interface EntityMap<T> {
  [id: number]: T;
}

export function entityArrayToObject<T extends Entity>(
  array: T[]
): EntityMap<T> {
  return array.reduce((obj: EntityMap<T>, item) => {
    obj[item.id] = item;

    return obj;
  }, {});
}

export function entityObjectToArray<T>(object: EntityMap<T>): T[] {
  return Object.keys(object).map((objectKey) => object[Number(objectKey)]);
}
