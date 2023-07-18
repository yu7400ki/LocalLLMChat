import { v4 as uuidv4 } from "uuid";

const usedUuids: Map<string, string[]> = new Map();

export const uuid = (namespace?: string): string => {
  if (typeof namespace === "undefined") {
    return uuidv4();
  }

  if (!usedUuids.has(namespace)) {
    usedUuids.set(namespace, []);
  }
  const used = usedUuids.get(namespace)!;
  let id = uuidv4();
  while (used.includes(id)) {
    id = uuidv4();
  }
  used.push(id);
  return id;
};
