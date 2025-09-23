"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPages({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);
  return <div>{children}</div>;
}
