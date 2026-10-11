export function sanitizeForm<T extends Record<string, any>>(input: T) {
  const o: T = { ...input };
  for (const k in o) {
    const v = o[k];
    if (v === undefined) {
      delete o[k];
      continue;
    }

    if (typeof v === "string") {
      if (v.length) o[k] = v.trim();
      else delete o[k];
      continue;
    }

    // recursion
    if (isObject(v)) {
      o[k] = sanitizeForm(v);
      continue;
    }

    // recursion
    if (Array.isArray(v) && v) {
      o[k] = v
        .map((item: unknown) => {
          if (isObject(item)) {
            return sanitizeForm(item);
          }
          if (typeof item === "string") {
            return item.trim();
          }
          return item;
        })
        .filter(Boolean);
    }

    o[k] = v;
  }
  return o;
}

function isObject(item: unknown): item is object {
  return !Array.isArray(item) && typeof item === "object" && !!item;
}

export function transformTitle<T extends string>(title: T | ({} & string)) {
  if (title === "MR") return "Mr.";
  if (title === "MRS") return "Mrs.";
  return null;
}
