"use client";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { NavMenu } from "./NavMenu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/context/useAuth";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="fixed flex items-center justify-between w-full px-4 md:px-6 h-16 bg-[#0a0a0a]/90">
      <Link href="/" title="flox" className="font-bold text-2xl text-[#4FD1C5]">
        flox
      </Link>
      <NavMenu />
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer outline-none">
          <UserRound />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`z-[60] ${
            !user && false && "bg-transparent border-none"
          } mt-2 mx-5`}
        >
          {user ? (
            <>
              <DropdownMenuGroup>
                <Link href="#">
                  <DropdownMenuItem className="cursor-pointer">
                    Ajustes
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                Cerrar sesión
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuGroup>
                <Link href="/login">
                  <DropdownMenuItem className="cursor-pointer">
                    Iniciar sesión
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <Link href="/register">
                <DropdownMenuItem className="cursor-pointer">
                  Crear cuenta
                </DropdownMenuItem>
              </Link>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
