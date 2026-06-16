import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/app/admin/components/RoleGuard";
import { createClient } from "@/lib/server";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
} from "@mui/material";
import type { Profile, Role } from "@/types";

const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  operator: "Operador",
};

const ROLE_COLORS: Record<Role, "error" | "warning" | "default"> = {
  owner: "error",
  admin: "warning",
  operator: "default",
};

async function getUsers(currentRole: Role): Promise<Profile[]> {
  const supabase = await createClient();

  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });

  // Admin solo puede ver operadores (no owners ni otros admins)
  if (currentRole === "admin") {
    query = query.eq("role", "operator");
  }

  const { data } = await query;
  return (data as Profile[]) ?? [];
}

export default async function UsersPage() {
  const profile = await requireAuth();
  const users = await getUsers(profile.role);

  return (
    <RoleGuard role={profile.role} module="users">
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Usuarios
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.role === "owner"
                ? "Todos los usuarios del sistema."
                : "Usuarios con rol Operador."}
            </Typography>
          </Box>
          {/* El botón de crear usuario irá aquí en la siguiente iteración */}
        </Box>

        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Último acceso</TableCell>
                <TableCell>Creado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No hay usuarios registrados.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar src={u.avatar_url ?? undefined} sx={{ width: 28, height: 28, fontSize: "0.75rem" }}>
                          {u.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Typography variant="body2">{u.name ?? "—"}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ROLE_LABELS[u.role]}
                        color={ROLE_COLORS[u.role]}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.is_active ? "Activo" : "Inactivo"}
                        color={u.is_active ? "success" : "default"}
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {u.last_login_at
                          ? new Date(u.last_login_at).toLocaleDateString("es-MX", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Nunca"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(u.created_at).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </RoleGuard>
  );
}
