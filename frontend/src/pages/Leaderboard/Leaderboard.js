import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const Leaderboard = () => {
  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Leaderboard
        </Typography>
        <Typography variant="body1">
          This page will show user rankings and scores.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Leaderboard;