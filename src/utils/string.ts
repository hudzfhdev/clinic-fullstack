export const capitalize = <T extends string>(input: T) => {
  if (!input.length) return input;
  return input.at(0)?.toUpperCase() + input.slice(1);
};
