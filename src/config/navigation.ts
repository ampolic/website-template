export type NavDropdownItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavDropdownGroup = {
  heading?: string;
  items: NavDropdownItem[];
};

export type NavLink = {
  label: string;
  href: string;
  groups?: never;
};

export type NavDropdown = {
  label: string;
  href?: string;
  groups: NavDropdownGroup[];
};

export type NavItem = NavLink | NavDropdown;

export const navigationLinks: NavItem[] = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Services",
    href: "/services",
  },
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];
