import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const Tools = () => {
  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Security Tools
        </Typography>
        <Typography variant="body1">
          This page will integrate Wireshark, Suricata, and Syslog viewers.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Tools;