import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const ScenarioDetail = () => {
  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Scenario Details
        </Typography>
        <Typography variant="body1">
          This page will show detailed scenario information and allow starting incidents.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ScenarioDetail;