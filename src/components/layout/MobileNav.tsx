import { MenuIcon, PhoneIcon } from "lucide-react";

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
  const isCurrentHref = (href: string) =>
    currentPath === href || currentPath.startsWith(`${href}/`);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="md:hidden"
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
        <nav className="grid gap-1 px-4" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <SheetClose key={item.href} asChild>
              <a
                className={
                  isCurrentHref(item.href)
                    ? "bg-accent text-accent-foreground focus-visible:bg-accent rounded-md px-3 py-3 text-sm font-medium transition-colors"
                    : "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent rounded-md px-3 py-3 text-sm font-medium transition-colors"
                }
                href={item.href}
                aria-current={isCurrentHref(item.href) ? "page" : undefined}
              >
                {item.label}
              </a>
            </SheetClose>
          ))}
        </nav>
        <SheetFooter>
          <Button asChild>
            <a href={cta.href}>{cta.label}</a>
          </Button>
          <Button variant="outline" asChild>
            <a href={phoneHref} aria-label={`Call ${businessName} at ${phone}`}>
              <PhoneIcon aria-hidden="true" />
              {phone}
            </a>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
