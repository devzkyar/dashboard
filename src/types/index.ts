export type Role = "owner" | "admin" | "operator";

export interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  role: Role;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  description: string;
  changes: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  // join
  profile?: Pick<Profile, "name" | "avatar_url">;
}

// Permisos por rol
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  owner: ["dashboard", "users", "audit", "profile"],
  admin: ["dashboard", "users", "profile"],
  operator: ["dashboard", "profile"],
};

export function canAccess(role: Role, module: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(module) ?? false;
}
