"use client";

import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import type { Profile } from "@/types";

interface AdminShellProps {
  profile: Profile;
  children: React.ReactNode;
}

const DRAWER_WIDTH = 240;

export function AdminShell({ profile, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggle = () => setSidebarOpen((prev) => !prev);
  const handleClose = () => setSidebarOpen(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <TopBar profile={profile} onMenuToggle={handleToggle} />

      <Sidebar open={sidebarOpen} onClose={handleClose} role={profile.role} />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          transition: (theme) =>
            theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          marginLeft: { md: sidebarOpen ? `${DRAWER_WIDTH}px` : 0 },
        }}
      >
        {/* Spacer para que el contenido no quede bajo la TopBar */}
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
