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
} from "@mui/material";
import type { AuditLog } from "@/types";

const ACTION_COLORS: Record<string, "error" | "success" | "warning" | "info" | "default"> = {
  DELETE: "error",
  CREATE: "success",
  UPDATE: "warning",
  LOGIN: "info",
};

async function getAuditLogs(): Promise<AuditLog[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("audit_logs")
    .select(`
      *,
      profile:profiles(name, avatar_url)
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  return (data as AuditLog[]) ?? [];
}

export default async function AuditPage() {
  const profile = await requireAuth();
  const logs = await getAuditLogs();

  return (
    <RoleGuard role={profile.role} module="audit">
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Auditoría
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Registro de todos los eventos del sistema. Últimas 100 entradas.
        </Typography>

        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Acción</TableCell>
                <TableCell>Entidad</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>IP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    Sin registros de auditoría.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Typography variant="caption" noWrap>
                        {new Date(log.created_at).toLocaleString("es-MX", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{log.profile?.name ?? log.user_id.slice(0, 8)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        color={ACTION_COLORS[log.action] ?? "default"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {log.entity}
                        {log.entity_id ? ` #${log.entity_id.slice(0, 8)}` : ""}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 260 }}>
                      <Typography variant="caption" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {log.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {log.ip_address ?? "—"}
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
