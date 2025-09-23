"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/shared/components/ui/navigation-menu";
import { NAV_ITEMS } from "../constants/routes";

export function NavMenu() {
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          {NAV_ITEMS.map((item, key) => (
            <NavigationMenuItem key={key}>
              {item.type === "link" && (
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={item.href} target={item.target}>
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              )}
              {item.type === "detailed" && (
                <>
                  <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-full gap-2 md:w-[500px] md:grid-cols-2">
                      {item.children &&
                        item.children.map((link, key) => (
                          <ListItem
                            key={key}
                            title={link.label}
                            href={link.href}
                          >
                            {link.description}
                          </ListItem>
                        ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
