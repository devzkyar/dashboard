"use client";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { usePathname, useRouter } from "next/navigation";
import type { Role } from "@/types";
import { canAccess } from "@/types";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  role: Role;
}

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    href: "/admin/core/dashboard",
    module: "dashboard",
  },
  {
    label: "Usuarios",
    icon: <PeopleIcon />,
    href: "/admin/core/users",
    module: "users",
  },
  {
    label: "Auditoría",
    icon: <AssignmentIcon />,
    href: "/admin/core/audit",
    module: "audit",
  },
];

const DRAWER_WIDTH = 240;

export function Sidebar({ open, onClose, role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const visibleItems = NAV_ITEMS.filter((item) => canAccess(role, item.module));

  const handleNavigation = (href: string) => {
    router.push(href);
    if (isMobile) onClose();
  };

  const drawerContent = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        pt: 1,
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography
          variant="overline"
          sx={{ color: "text.secondary", fontSize: "0.65rem", fontWeight: 700, letterSpacing: 1.5 }}
        >
          Navegación
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1, pt: 1 }}>
        {visibleItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <ListItem key={item.module} disablePadding sx={{ mb: 0.5, px: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.href)}
                selected={isActive}
                sx={{
                  borderRadius: 1.5,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "& .MuiListItemIcon-root": { color: "primary.contrastText" },
                    "&:hover": { bgcolor: "primary.dark" },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: isActive ? 600 : 400 }}>
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop: Drawer permanente togglable
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          top: 64, // altura de la TopBar
          height: "calc(100% - 64px)",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
