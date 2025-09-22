"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/useAuth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage({ className }: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const [error, setError] = useState<string>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);

    const username = (data.get("username") as string)?.trim();
    const password = (data.get("password") as string) || "";

    try {
      await login(username, password);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else console.error(err);
    }
    form.reset();
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)}>
          <Card>
            <CardHeader>
              <CardTitle>Acceder a flox</CardTitle>
              <CardDescription>Tu mundo te espera, conéctate</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="username">Usuario</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Usuario"
                      minLength={3}
                      maxLength={32}
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Contraseña"
                      minLength={8}
                      required
                    />
                    <a
                      href="#"
                      className="text-sm text-right inline-block underline-offset-4 hover:underline"
                    >
                      He olvidado mi contraseña
                    </a>
                  </div>
                  {error && (
                    <p className="text-center text-sm text-[#F56565]">
                      {error}
                    </p>
                  )}
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full cursor-pointer">
                      Entrar
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  ¿Acabas de llegar?{" "}
                  <Link href="/register">
                    <button className="underline underline-offset-4 cursor-pointer">
                      Únete ahora
                    </button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
