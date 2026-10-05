export function sanitizeForm<T extends Record<string, any>>(input: T) {
  const o: T = { ...input };
  for (const k in input) {
    const v = input[k];
    if (typeof v === "string" && !v.length) {
      delete o[k];
      continue;
    }
    // recursion
    if (!Array.isArray(v) && typeof v === "object" && v) {
      o[k] = sanitizeForm(v);
      continue;
    }
    if (v === undefined) {
      delete o[k];
      continue;
    }
    o[k] = v;
  }
  return o;
}
