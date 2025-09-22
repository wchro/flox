import { NavItem } from "../types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Inicio",
    type: "link",
    href: "/",
  },
  {
    label: "Explorar",
    type: "detailed",
    href: "#",
    children: [
      {
        label: "Novedades",
        href: "#",
        description: "Recién llegado.",
      },
      {
        label: "Acción",
        href: "#",
        description: "Adrenalina y ritmo sin pausas.",
      },
      {
        label: "Drama",
        href: "#",
        description: "Historias que dejan huella.",
      },
      {
        label: "Comedia",
        href: "#",
        description: "Ríe sin medida.",
      },
      {
        label: "Documentales",
        href: "#",
        description: "Aprende e inspírate.",
      },
      {
        label: "Infantil",
        href: "#",
        description: "Diversión para los peques.",
      },
    ],
  },
  {
    label: "GitHub",
    type: "link",
    href: "https://github.com/wchro/flox",
    target: "_blank",
  },
];
