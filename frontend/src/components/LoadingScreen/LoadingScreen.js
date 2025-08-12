import React from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 3,
        }}
      >
        <SecurityIcon
          sx={{
            fontSize: 64,
            color: 'primary.main',
            mb: 2,
          }}
        />
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 500, color: 'text.primary' }}
        >
          Incident Response Platform
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}
        >
          Loading security training environment...
        </Typography>
        <CircularProgress size={40} thickness={4} />
      </Paper>
    </Box>
  );
};
export default LoadingScreen;