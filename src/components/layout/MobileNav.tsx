import { ChevronDownIcon, MenuIcon, PhoneIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { NavItem } from "@/config/navigation";
import { isCurrentHref } from "@/lib/nav-utils";

type MobileNavProps = {
  businessName: string;
  phone: string;
  phoneHref: string;
  cta: {
    label: string;
    href: string;
  };
  navItems: NavItem[];
  currentPath: string;
};

export function MobileNav({
  businessName,
  phone,
  phoneHref,
  cta,
  navItems,
  currentPath,
}: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="bg-background/55 ring-border/70 rounded-full shadow-sm backdrop-blur md:hidden"
          aria-label="Open navigation"
        >
          <MenuIcon aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[min(22rem,90vw)]">
        <SheetHeader>
          <SheetTitle>{businessName}</SheetTitle>
          <SheetDescription>
            Navigate the site or get in touch.
          </SheetDescription>
        </SheetHeader>
        <nav
          className="bg-muted/60 ring-border/70 mx-4 grid gap-1 rounded-xl p-1 ring-1"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => {
            if (item.groups) {
              return (
                <MobileDropdown
                  key={item.label}
                  item={item}
                  currentPath={currentPath}
                />
              );
            }

            return (
              <SheetClose key={item.href} asChild>
                <a
                  className={
                    isCurrentHref(currentPath, item.href)
                      ? "bg-background text-foreground focus-visible:bg-background rounded-lg p-3 text-sm font-medium shadow-xs transition-colors"
                      : "text-muted-foreground hover:bg-background hover:text-foreground focus-visible:bg-background rounded-lg p-3 text-sm font-medium transition-colors"
                  }
                  href={item.href}
                  aria-current={
                    isCurrentHref(currentPath, item.href) ? "page" : undefined
                  }
                  data-astro-prefetch
                >
                  {item.label}
                </a>
              </SheetClose>
            );
          })}
        </nav>
        <SheetFooter>
          <Button className="shadow-primary/20 rounded-full! shadow-sm" asChild>
            <a href={cta.href} data-astro-prefetch>
              {cta.label}
            </a>
          </Button>
          {phone && phoneHref ? (
            <Button variant="outline" className="rounded-full" asChild>
              <a
                href={phoneHref}
                aria-label={`Call ${businessName} at ${phone}`}
              >
                <PhoneIcon aria-hidden="true" />
                {phone}
              </a>
            </Button>
          ) : null}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

type MobileDropdownProps = {
  item: Extract<NavItem, { groups: unknown }>;
  currentPath: string;
};

function MobileDropdown({ item, currentPath }: MobileDropdownProps) {
  const allItems = item.groups.flatMap((g) => g.items);
  const isChildActive = allItems.some((child) =>
    isCurrentHref(currentPath, child.href),
  );
  const [open, setOpen] = useState(isChildActive);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        aria-expanded={open}
        className={[
          "flex w-full items-center justify-between rounded-lg p-3 text-sm font-medium transition-colors",
          isChildActive
            ? "bg-background text-foreground shadow-xs"
            : "text-muted-foreground hover:bg-background hover:text-foreground",
        ].join(" ")}
      >
        {item.label}
        <ChevronDownIcon
          className={[
            "size-4 shrink-0 transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div className="mt-1 grid gap-0.5 pl-3">
          {item.groups.map((group, gi) => (
            <div key={gi}>
              {group.heading ? (
                <p className="text-muted-foreground px-3 py-1 text-xs font-semibold tracking-wider uppercase">
                  {group.heading}
                </p>
              ) : null}
              {group.items.map((child) => (
                <SheetClose key={child.href} asChild>
                  <a
                    className={
                      isCurrentHref(currentPath, child.href)
                        ? "bg-background text-foreground focus-visible:bg-background rounded-lg p-3 text-sm font-medium shadow-xs transition-colors"
                        : "text-muted-foreground hover:bg-background hover:text-foreground focus-visible:bg-background rounded-lg p-3 text-sm font-medium transition-colors"
                    }
                    href={child.href}
                    aria-current={
                      isCurrentHref(currentPath, child.href)
                        ? "page"
                        : undefined
                    }
                    data-astro-prefetch
                  >
                    {child.label}
                    {child.description ? (
                      <span className="text-muted-foreground block text-xs">
                        {child.description}
                      </span>
                    ) : null}
                  </a>
                </SheetClose>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default MobileNav;
