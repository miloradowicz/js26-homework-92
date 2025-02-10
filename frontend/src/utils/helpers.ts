export const stringToColor = (str: string) =>
  '#' +
  (Array.from({ length: str.length }, (_, i) => str.charCodeAt(i)).reduce((p, n) => (n + p) << (5 - p), 0) & 0xffffff)
    .toString(16)
    .slice(-6);
