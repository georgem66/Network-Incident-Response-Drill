import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
const Profile = () => {
  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="body1">
          This page will show user profile and settings.
        </Typography>
      </Paper>
    </Box>
  );
};
export default Profile;