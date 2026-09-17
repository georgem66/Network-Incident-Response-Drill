import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button, Chip, Alert, LinearProgress, Stack } from '@mui/material';
import { ArrowForward, Radar, AssignmentOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { scenarioService, incidentService, scoresService } from '../../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let current = true;
    setError(false);
    setData(null);
    Promise.all([scenarioService.getAll(), incidentService.getAll({ status: 'active' }), scoresService.getUserScores()])
      .then(([scenarios, attempts, stats]) => {
        if (current) setData({ scenarios: scenarios.data.scenarios.slice(0, 3), attempts: attempts.data.attempts.slice(0, 5), stats: stats.data.stats });
      }).catch(() => { if (current) setError(true); });
    return () => { current = false; };
  }, [retry]);
  return <Box>
    <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ mb: 4 }}>
      <Box><Typography variant="overline" color="primary.main">WORKSPACE / OVERVIEW</Typography>
        <Typography variant="h4" component="h1">Practice with purpose.</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>Welcome back, {user?.firstName || user?.username}. Your next response starts here.</Typography></Box>
      <Button variant="contained" endIcon={<ArrowForward />} onClick={() => navigate('/scenarios')}>Browse scenarios</Button>
    </Stack>
    {error ? <Alert severity="error" action={<Button color="inherit" onClick={() => setRetry(v => v + 1)}>Retry</Button>}>Training data is unavailable. Check the API connection and try again.</Alert> : !data ? <Box role="status"><LinearProgress /><Typography sx={{ mt: 2 }}>Loading your training workspace…</Typography></Box> : <>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          ['Completed exercises', data.stats.scenariosCompleted ?? 0, 'Your training record'],
          ['Best score', data.stats.bestScore ?? 0, 'Points earned'],
          ['Average score', data.stats.averageScore ?? 0, 'Across your attempts'],
          ['Time invested', `${Math.floor((data.stats.totalTime || 0) / 60)}m`, 'Deliberate practice'],
        ].map(([label, value, note]) => <Grid item xs={6} md={3} key={label}><Paper sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
          <Typography variant="body2" color="text.secondary">{label}</Typography><Typography sx={{ fontSize: '2rem', letterSpacing: '-.04em', my: 1, fontWeight: 600 }}>{value}</Typography>
          <Typography variant="caption" color="text.secondary">{note}</Typography></Paper></Grid>)}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}><Radar color="primary" /><Typography component="h2" variant="h5">Your next investigation</Typography></Stack>
          {data.scenarios.length === 0 && <Paper sx={{ p: 3 }}>No scenarios available yet. Ask your instructor to publish an exercise.</Paper>}
          {data.scenarios.map((scenario, i) => <Paper key={scenario._id} sx={{ p: 3, mb: 2, borderLeft: '3px solid', borderLeftColor: i === 0 ? 'primary.main' : 'divider' }}>
            <Stack direction="row" justifyContent="space-between" gap={2} sx={{ mb: 2 }}><Typography variant="overline" color="text.secondary">EXERCISE {String(i + 1).padStart(2, '0')}</Typography><Chip size="small" variant="outlined" label={scenario.severity} /></Stack>
            <Typography variant="h5" component="h3">{scenario.title}</Typography>
            <Typography color="text.secondary" sx={{ my: 2, maxWidth: '65ch' }}>{scenario.description}</Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Typography variant="body2" color="text.secondary">{scenario.difficultyLevel} · {scenario.estimatedCompletionTime} min</Typography>
              <Button endIcon={<ArrowForward />} onClick={() => navigate(`/scenarios/${scenario._id}`)}>View briefing</Button>
            </Stack></Paper>)}
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, mb: 3 }}><Typography variant="overline" color="primary.main">THE RESPONSE CYCLE</Typography><Typography variant="h5" component="h2" sx={{ mt: 1, mb: 3 }}>A method, not a guess.</Typography>
            {['Observe the evidence', 'Build your timeline', 'Decide and document', 'Reflect on the outcome'].map((step, i) => <Stack direction="row" key={step} gap={2} sx={{ py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}><Typography color="primary.main" variant="body2">0{i + 1}</Typography><Typography variant="body2">{step}</Typography></Stack>)}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>Training environment. Evidence is simulated; this is not live network monitoring.</Typography>
          </Paper>
          <Paper sx={{ p: 3 }}><Typography variant="h6" component="h2" sx={{ mb: 2 }}>In progress</Typography>
            {data.attempts.length === 0 ? <Box><AssignmentOutlined sx={{ color: 'text.secondary', mb: 1 }} /><Typography variant="body2" color="text.secondary">A clear desk. Start an exercise to create your first investigation.</Typography></Box> : data.attempts.map(attempt => <Button key={attempt.id} fullWidth sx={{ justifyContent: 'space-between', textAlign: 'left' }} endIcon={<ArrowForward />} onClick={() => navigate(`/incident/${attempt.id}`)}>{String(attempt.scenarioId).replace(/_/g, ' ')} · {attempt.status}</Button>)}
          </Paper>
        </Grid>
      </Grid>
    </>}
  </Box>;
}
