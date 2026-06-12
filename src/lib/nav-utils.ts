export function isCurrentHref(currentPath: string, href: string): boolean {
  if (href.startsWith("#")) {
    return false;
  }
  return currentPath === href || currentPath.startsWith(`${href}/`);
}
