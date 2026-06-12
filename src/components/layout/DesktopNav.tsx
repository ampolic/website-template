import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { NavItem } from "@/config/navigation";
import { isCurrentHref } from "@/lib/nav-utils";

type DesktopNavProps = {
  navItems: NavItem[];
  currentPath: string;
};

export function DesktopNav({ navItems, currentPath }: DesktopNavProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList className="ring-border/70 gap-1 rounded-full p-1 shadow-sm ring-1 shadow-slate-950/5 backdrop-blur">
        {navItems.map((item) => {
          if (item.groups) {
            return (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuTrigger
                  className={
                    item.href && isCurrentHref(currentPath, item.href)
                      ? "bg-background text-foreground shadow-xs"
                      : undefined
                  }
                >
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <DropdownContent
                    groups={item.groups}
                    currentPath={currentPath}
                  />
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink
                href={item.href}
                data-astro-prefetch
                data-active={isCurrentHref(currentPath, item.href)}
                className={[
                  "block max-w-20 truncate rounded-full px-3.5 py-2 text-sm font-medium transition-all hover:shadow-xs lg:max-w-none",
                  isCurrentHref(currentPath, item.href)
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-background/85 hover:text-foreground",
                ].join(" ")}
                aria-current={
                  isCurrentHref(currentPath, item.href) ? "page" : undefined
                }
                title={item.label}
              >
                {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

type DropdownContentProps = {
  groups: NonNullable<Extract<NavItem, { groups: unknown }>["groups"]>;
  currentPath: string;
};

function DropdownContent({ groups, currentPath }: DropdownContentProps) {
  const isMegaMenu = groups.length > 1 || (groups[0]?.items.length ?? 0) > 5;

  if (isMegaMenu) {
    return (
      <ul
        className={[
          "grid gap-x-6 gap-y-1 p-4",
          groups.length === 2
            ? "w-[32rem] grid-cols-2"
            : "w-[48rem] grid-cols-3",
        ].join(" ")}
      >
        {groups.map((group, gi) => (
          <li key={gi}>
            {group.heading ? (
              <p className="text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
                {group.heading}
              </p>
            ) : null}
            <ul className="grid gap-0.5">
              {group.items.map((child) => (
                <li key={child.href}>
                  <NavigationMenuLink
                    href={child.href}
                    data-astro-prefetch
                    data-active={isCurrentHref(currentPath, child.href)}
                    aria-current={
                      isCurrentHref(currentPath, child.href)
                        ? "page"
                        : undefined
                    }
                  >
                    <span className="font-medium">{child.label}</span>
                    {child.description ? (
                      <span className="text-muted-foreground text-xs/snug">
                        {child.description}
                      </span>
                    ) : null}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid w-48 gap-0.5 p-2">
      {groups[0]?.items.map((child) => (
        <li key={child.href}>
          <NavigationMenuLink
            href={child.href}
            data-astro-prefetch
            data-active={isCurrentHref(currentPath, child.href)}
            aria-current={
              isCurrentHref(currentPath, child.href) ? "page" : undefined
            }
          >
            <span className="font-medium">{child.label}</span>
            {child.description ? (
              <span className="text-muted-foreground text-xs/snug">
                {child.description}
              </span>
            ) : null}
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  );
}

export default DesktopNav;
