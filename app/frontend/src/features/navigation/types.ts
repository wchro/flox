export type NavItem = {
  label: string;
  type?: "link" | "dropdown" | "detailed";
  href: string;
  target?: "_blank" | "_self";
  description?: string;
  children?: NavItem[];
};
