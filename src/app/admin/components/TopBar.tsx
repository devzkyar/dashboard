"use client";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth";
import type { Profile } from "@/types";

interface TopBarProps {
  profile: Profile;
  onMenuToggle: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  operator: "Operador",
};

const ROLE_COLORS: Record<string, "error" | "warning" | "default"> = {
  owner: "error",
  admin: "warning",
  operator: "default",
};

export function TopBar({ profile, onMenuToggle }: TopBarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleProfile = () => {
    handleClose();
    router.push("/admin/core/profile");
  };

  const handleSignOut = async () => {
    handleClose();
    await signOut();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton
          edge="start"
          onClick={onMenuToggle}
          aria-label="toggle navigation"
          size="medium"
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Admin Panel
        </Typography>

        <Chip
          label={ROLE_LABELS[profile.role] ?? profile.role}
          color={ROLE_COLORS[profile.role] ?? "default"}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: "0.7rem" }}
        />

        <Box
          onClick={handleOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            px: 1,
            py: 0.5,
            borderRadius: 2,
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}
          >
            {profile.name ?? "Usuario"}
          </Typography>
          <Avatar
            src={profile.avatar_url ?? undefined}
            alt={profile.name ?? "Usuario"}
            sx={{ width: 32, height: 32, fontSize: "0.85rem" }}
          >
            {profile.name?.[0]?.toUpperCase()}
          </Avatar>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{ paper: { sx: { mt: 1, minWidth: 180 } } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {profile.name ?? "Usuario"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {ROLE_LABELS[profile.role]}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfile}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Editar perfil</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleSignOut} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Cerrar sesión</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}