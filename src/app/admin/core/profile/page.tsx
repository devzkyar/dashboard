import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/app/admin/components/RoleGuard";
import {
  Typography,
  Box,
  Paper,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  operator: "Operador",
};

export default async function ProfilePage() {
  const profile = await requireAuth();

  return (
    <RoleGuard role={profile.role} module="profile">
      <Box sx={{ maxWidth: 480 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Mi perfil
        </Typography>

        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          {/* Header con avatar */}
          <Box
            sx={{
              bgcolor: "primary.main",
              height: 80,
              position: "relative",
            }}
          />
          <Box sx={{ px: 3, pb: 3 }}>
            <Avatar
              src={profile.avatar_url ?? undefined}
              alt={profile.name ?? "Usuario"}
              sx={{
                width: 72,
                height: 72,
                fontSize: "1.5rem",
                border: "3px solid white",
                mt: -4.5,
                mb: 1.5,
              }}
            >
              {profile.name?.[0]?.toUpperCase()}
            </Avatar>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Typography variant="h6" fontWeight={700}>
                {profile.name ?? "Sin nombre"}
              </Typography>
              <Chip
                label={ROLE_LABELS[profile.role] ?? profile.role}
                size="small"
                variant="outlined"
                color={profile.role === "owner" ? "error" : profile.role === "admin" ? "warning" : "default"}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Row label="ID" value={profile.id} mono />
              <Row label="Estado" value={profile.is_active ? "Activo" : "Inactivo"} />
              <Row
                label="Último acceso"
                value={
                  profile.last_login_at
                    ? new Date(profile.last_login_at).toLocaleString("es-MX")
                    : "Nunca"
                }
              />
              <Row
                label="Cuenta creada"
                value={new Date(profile.created_at).toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              />
            </Box>
          </Box>
        </Paper>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
          Para cambiar tu nombre o avatar, contacta a un administrador.
        </Typography>
      </Box>
    </RoleGuard>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={500}
        sx={{ fontFamily: mono ? "monospace" : undefined, wordBreak: "break-all" }}
      >
        {value}
      </Typography>
    </Box>
  );
}
