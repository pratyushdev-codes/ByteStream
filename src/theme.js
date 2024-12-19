// src/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  // You can add custom theme options here if needed
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});