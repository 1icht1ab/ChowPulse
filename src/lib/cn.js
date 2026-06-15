// Une clases condicionalmente (ligero, sin dependencias externas).
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
