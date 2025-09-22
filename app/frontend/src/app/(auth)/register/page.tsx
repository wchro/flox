"use client";

import { cn } from "@/lib/utils";
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
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage({
  className,
}: React.ComponentProps<"div">) {
  const { registerUser } = useAuth();
  const [error, setError] = useState<string>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);

    const username = (data.get("username") as string)?.trim();
    const password = (data.get("password") as string) || "";
    const verifiedPassword = (data.get("verified_password") as string) || "";

    if (password !== verifiedPassword)
      return setError("Las contraseñas no coinciden");

    try {
      await registerUser(username, password);
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
              <CardTitle>Regístrate</CardTitle>
              <CardDescription>Lo que quieras, cuando quieras</CardDescription>
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
                    <div className="grid gap-3">
                      <Label htmlFor="password">Confirmar contraseña</Label>
                      <Input
                        id="verified_password"
                        name="verified_password"
                        type="password"
                        placeholder="Contraseña"
                        minLength={8}
                        required
                      />
                    </div>
                  </div>
                  {error && (
                    <p className="text-sm text-[#F56565] w-50">{error}</p>
                  )}
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full cursor-pointer">
                      Crear cuenta
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  ¿Registrad@?{" "}
                  <Link href="/login">
                    <button className="underline underline-offset-4 cursor-pointer">
                      Iniciar sesión
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
