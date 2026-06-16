import { notFound } from "next/navigation";
import type { Role } from "@/types";
import { canAccess } from "@/types";

interface RoleGuardProps {
  role: Role;
  module: string;
  children: React.ReactNode;
}

/**
 * Server Component.
 * Lanza 404 si el rol no tiene acceso al módulo.
 * Usar en cada page.tsx de /admin/core/*.
 */
export function RoleGuard({ role, module, children }: RoleGuardProps) {
  if (!canAccess(role, module)) {
    notFound();
  }
  return <>{children}</>;
}
