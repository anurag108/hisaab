import type { Metadata } from "next";
import { createTheme, alpha, getContrastRatio } from '@mui/material/styles';
import Box from '@mui/material/Box';

import HisaabAppBar from './navigation/app_bar';
import HisaabMenuBar from './navigation/menu_bar';
import "./globals.css";
import Divider from "@mui/material/Divider";

export const metadata: Metadata = {
  title: "Hisaab",
  description: "One stop accounting!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <HisaabAppBar />
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ flexGrow: 2 }}><HisaabMenuBar /></Box>
          <Box><Divider orientation="vertical" flexItem sx={{ width: 5 }} /></Box>
          <Box sx={{ flexGrow: 7 }}>{children}</Box>
        </Box>
      </body>
    </html>
  );
}
