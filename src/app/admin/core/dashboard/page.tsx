import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/app/admin/components/RoleGuard";
import { Typography, Grid, Paper, Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { createClient } from "@/lib/server";

async function getDashboardStats() {
  const supabase = await createClient();

  const [{ count: totalUsers }, { count: totalLogs }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("audit_logs").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentLogs } = await supabase
    .from("audit_logs")
    .select("id, action, entity, description, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return { totalUsers: totalUsers ?? 0, totalLogs: totalLogs ?? 0, recentLogs: recentLogs ?? [] };
}

export default async function DashboardPage() {
  const profile = await requireAuth();
  const { totalUsers, totalLogs, recentLogs } = await getDashboardStats();

  return (
    <RoleGuard role={profile.role} module="dashboard">
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Bienvenido, {profile.name ?? "usuario"}.
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    borderRadius: 1.5,
                    p: 1,
                    display: "flex",
                    color: "white",
                  }}
                >
                  <PeopleIcon />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totalUsers}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Usuarios registrados
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    bgcolor: "warning.main",
                    borderRadius: 1.5,
                    p: 1,
                    display: "flex",
                    color: "white",
                  }}
                >
                  <AssignmentIcon />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totalLogs}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Eventos auditados
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} gutterBottom>
          Actividad reciente
        </Typography>
        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          {recentLogs.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Sin actividad registrada aún.
              </Typography>
            </Box>
          ) : (
            recentLogs.map((log, i) => (
              <Box
                key={log.id}
                sx={{
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  borderBottom: i < recentLogs.length - 1 ? "1px solid" : "none",
                  borderColor: "divider",
                }}
              >
                <AccessTimeIcon fontSize="small" color="disabled" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">{log.description}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {log.action} · {log.entity}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {new Date(log.created_at).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            ))
          )}
        </Paper>
      </Box>
    </RoleGuard>
  );
}