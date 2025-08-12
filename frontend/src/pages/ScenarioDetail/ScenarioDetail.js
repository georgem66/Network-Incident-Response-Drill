import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Paper, Box, Button, Grid, Card, CardContent, 
  Chip, Alert, Stepper, Step, StepLabel, StepContent,
  List, ListItem, ListItemText, ListItemIcon,
  LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  PlayArrow, Security, Warning, CheckCircle, 
  Info, Assignment, Timeline, School
} from '@mui/icons-material';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
const ScenarioDetail = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDialogOpen, setStartDialogOpen] = useState(false);
  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const response = await apiService.getScenario(scenarioId);
        setScenario(response.data);
      } catch (error) {
        console.error('Error fetching scenario:', error);
        toast.error('Failed to load scenario details');
      } finally {
        setLoading(false);
      }
    };
    if (scenarioId) {
      fetchScenario();
    }
  }, [scenarioId]);
  const handleStartIncident = async () => {
    try {
      const response = await apiService.startIncident(scenarioId);
      toast.success('Incident started successfully!');
      navigate(`/incident-response/${response.data.attemptId}`);
    } catch (error) {
      console.error('Error starting incident:', error);
      toast.error('Failed to start incident');
    }
    setStartDialogOpen(false);
  };
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };
  const getStepIcon = (stepType) => {
    switch (stepType) {
      case 'detection': return <Security />;
      case 'analysis': return <Assignment />;
      case 'response': return <Timeline />;
      case 'recovery': return <CheckCircle />;
      default: return <Info />;
    }
  };
  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading scenario details...
        </Typography>
      </Box>
    );
  }
  if (!scenario) {
    return (
      <Box>
        <Alert severity="error">
          Scenario not found. Please check the URL and try again.
        </Alert>
      </Box>
    );
  }
  return (
    <Box>
      {}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {scenario.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {scenario.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip 
                label={`Severity: ${scenario.severity}`}
                color={getSeverityColor(scenario.severity)}
                variant="outlined"
              />
              <Chip 
                label={`Difficulty: ${scenario.difficulty}/5`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label={`Est. Time: ${scenario.estimatedTime || '30-45 min'}`}
                color="info"
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={() => setStartDialogOpen(true)}
                sx={{ mb: 2, width: '100%' }}
              >
                Start Incident Response
              </Button>
              <Typography variant="caption" display="block" color="text.secondary">
                Click to begin the incident response drill
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Grid container spacing={3}>
        {}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                Learning Objectives
              </Typography>
              <List dense>
                {scenario.learningObjectives?.map((objective, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={objective} />
                  </ListItem>
                )) || (
                  <>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="primary" fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Identify attack vectors and indicators of compromise" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="primary" fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Apply incident response methodology" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="primary" fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Use security tools for analysis and mitigation" />
                    </ListItem>
                  </>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        {}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                Attack Information
              </Typography>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Attack Vector:
              </Typography>
              <Typography variant="body2" paragraph>
                {scenario.attackVector || 'Web application vulnerability exploitation'}
              </Typography>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Indicators of Compromise (IoCs):
              </Typography>
              <List dense>
                {scenario.indicators?.map((indicator, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={indicator}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                )) || (
                  <>
                    <ListItem>
                      <ListItemText primary="Suspicious network traffic patterns" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Unusual system behavior" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Unauthorized access attempts" />
                    </ListItem>
                  </>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        {}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                Incident Response Steps
              </Typography>
              <Stepper activeStep={-1} orientation="vertical">
                {scenario.steps?.map((step, index) => (
                  <Step key={index}>
                    <StepLabel
                      icon={getStepIcon(step.type)}
                      StepIconProps={{ style: { color: 'primary' } }}
                    >
                      <Typography variant="subtitle1">
                        {step.title || `Step ${index + 1}`}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                      {step.tools && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="primary">
                            Tools: {step.tools.join(', ')}
                          </Typography>
                        </Box>
                      )}
                    </StepContent>
                  </Step>
                )) || (
                  <>
                    <Step>
                      <StepLabel icon={<Security />}>
                        <Typography variant="subtitle1">Detection & Analysis</Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary">
                          Identify the incident and gather initial information using monitoring tools.
                        </Typography>
                      </StepContent>
                    </Step>
                    <Step>
                      <StepLabel icon={<Assignment />}>
                        <Typography variant="subtitle1">Containment</Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary">
                          Isolate affected systems to prevent further damage.
                        </Typography>
                      </StepContent>
                    </Step>
                    <Step>
                      <StepLabel icon={<Timeline />}>
                        <Typography variant="subtitle1">Eradication & Recovery</Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary">
                          Remove threats and restore systems to normal operation.
                        </Typography>
                      </StepContent>
                    </Step>
                    <Step>
                      <StepLabel icon={<CheckCircle />}>
                        <Typography variant="subtitle1">Lessons Learned</Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary">
                          Document the incident and improve security measures.
                        </Typography>
                      </StepContent>
                    </Step>
                  </>
                )}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {}
      <Dialog 
        open={startDialogOpen} 
        onClose={() => setStartDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Start Incident Response Drill
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            You are about to start the incident response drill for "{scenario.title}". 
            This will begin timing your response and track your progress.
          </Alert>
          <Typography variant="body2" paragraph>
            During this drill you will:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" fontSize="small" /></ListItemIcon>
              <ListItemText primary="Analyze security alerts and logs" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" fontSize="small" /></ListItemIcon>
              <ListItemText primary="Use security tools to investigate the incident" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" fontSize="small" /></ListItemIcon>
              <ListItemText primary="Follow incident response procedures" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" fontSize="small" /></ListItemIcon>
              <ListItemText primary="Document your findings and actions" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStartDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleStartIncident}
            variant="contained"
            startIcon={<PlayArrow />}
          >
            Begin Drill
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ScenarioDetail;