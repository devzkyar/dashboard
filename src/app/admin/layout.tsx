import { requireAuth } from "@/lib/auth";
import { AdminShell } from "./components/AdminShell";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout del panel de administración.
 * Server Component: valida sesión en cada render.
 * Si no hay sesión válida, requireAuth() redirige a /login.
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
  const profile = await requireAuth();

  return <AdminShell profile={profile}>{children}</AdminShell>;
}
