let nextId = 0;

export const uid = (): string => (nextId++).toString();
