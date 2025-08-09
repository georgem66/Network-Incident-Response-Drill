import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Security,
  Assignment,
  EmojiEvents,
  Warning,
  CheckCircle,
  Error,
  Info,
  PlayArrow,
  TrendingUp,
  Timeline,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';

import { useAuth } from '../../contexts/AuthContext';
import { scenarioService, incidentService, scoresService } from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [scenariosRes, attemptsRes, statsRes] = await Promise.all([
          scenarioService.getAll(),
          incidentService.getAll({ status: 'active' }),
          scoresService.getUserScores(),
        ]);

        setScenarios(scenariosRes.data.scenarios.slice(0, 3));
        setRecentAttempts(attemptsRes.data.attempts.slice(0, 5));
        setUserStats(statsRes.data.stats);

        // Simulate real-time alerts
        setAlerts([
          {
            id: 1,
            type: 'warning',
            title: 'New Security Alert',
            message: 'Suspicious activity detected on network segment DMZ',
            timestamp: new Date(),
            severity: 'medium',
          },
          {
            id: 2,
            type: 'info',
            title: 'Training Reminder',
            message: 'Complete your SQL injection scenario for certification',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            severity: 'low',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'active':
        return 'primary';
      case 'paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Box sx={{ p: 2 }}>
          <Typography>Loading dashboard...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
          Welcome back, {user?.firstName || user?.username}! 👋
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          Ready to enhance your incident response skills? Choose a scenario below to get started.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Typography variant="h6">Scenarios</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {userStats.scenariosCompleted || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <EmojiEvents />
                </Avatar>
                <Typography variant="h6">Best Score</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {userStats.bestScore || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Points
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <Timeline />
                </Avatar>
                <Typography variant="h6">Avg Score</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {userStats.averageScore || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Points
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Typography variant="h6">Total Time</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {Math.floor((userStats.totalTime || 0) / 60)}m
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Training
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Available Scenarios */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Security sx={{ mr: 1 }} />
                Available Scenarios
              </Typography>
              <Box sx={{ mb: 2 }}>
                {scenarios.map((scenario) => (
                  <Card key={scenario._id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {scenario.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {scenario.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={scenario.severity} 
                              color={getSeverityColor(scenario.severity)}
                              size="small"
                            />
                            <Chip 
                              label={scenario.difficultyLevel} 
                              variant="outlined"
                              size="small"
                            />
                            <Chip 
                              label={`${scenario.estimatedCompletionTime}min`} 
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                        </Box>
                        <Button
                          variant="contained"
                          startIcon={<PlayArrow />}
                          onClick={() => navigate(`/scenarios/${scenario._id}`)}
                          sx={{ ml: 2 }}
                        >
                          Start
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/scenarios')}
              >
                View All Scenarios
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Live Alerts */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Warning sx={{ mr: 1 }} />
                Live Security Alerts
              </Typography>
              <List>
                {alerts.map((alert, index) => (
                  <React.Fragment key={alert.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        {alert.type === 'warning' && <Warning color="warning" />}
                        {alert.type === 'error' && <Error color="error" />}
                        {alert.type === 'info' && <Info color="info" />}
                        {alert.type === 'success' && <CheckCircle color="success" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={alert.title}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {alert.message}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < alerts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {recentAttempts.map((attempt, index) => (
                  <React.Fragment key={attempt.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={`Scenario: ${attempt.scenarioId.replace(/_/g, ' ')}`}
                        secondary={
                          <>
                            <Chip 
                              label={attempt.status} 
                              color={getStatusColor(attempt.status)}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            Score: {attempt.score}/{attempt.maxScore}
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentAttempts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                {recentAttempts.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No recent activity"
                      secondary="Start your first scenario to see activity here"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;