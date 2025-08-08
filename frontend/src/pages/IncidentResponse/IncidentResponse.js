import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Paper, Box, Button, Grid, Card, CardContent, 
  Stepper, Step, StepLabel, StepContent, TextField, Chip,
  List, ListItem, ListItemText, ListItemIcon,
  LinearProgress, Alert, Dialog, DialogTitle, DialogContent, 
  DialogActions, Tabs, Tab, FormGroup, FormControlLabel, Checkbox
} from '@mui/material';
import {
  CheckCircle, RadioButtonUnchecked, Security, Timeline, Assignment,
  PlayArrow, Pause, Stop, HelpOutline, Send
} from '@mui/icons-material';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

const IncidentResponse = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepAnswers, setStepAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [hints, setHints] = useState({});
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [currentHint, setCurrentHint] = useState('');

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const response = await apiService.getIncidentAttempt(attemptId);
        setAttempt(response.data);
        setCurrentStep(response.data.currentStep || 0);
        setTimer(response.data.timeElapsed || 0);
      } catch (error) {
        console.error('Error fetching attempt:', error);
        toast.error('Failed to load incident response data');
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
      fetchAttempt();
    }
  }, [attemptId]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStepComplete = async (stepIndex) => {
    try {
      await apiService.updateIncidentProgress(attemptId, {
        currentStep: stepIndex + 1,
        answers: stepAnswers,
        timeElapsed: timer
      });
      setCurrentStep(stepIndex + 1);
      toast.success('Step completed successfully!');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to save progress');
    }
  };

  const handleAnswer = (stepIndex, questionId, answer) => {
    setStepAnswers(prev => ({
      ...prev,
      [`${stepIndex}_${questionId}`]: answer
    }));
  };

  const getHint = async (stepIndex) => {
    try {
      const response = await apiService.getHint(attemptId, stepIndex);
      setCurrentHint(response.data.hint);
      setShowHintDialog(true);
      setHints(prev => ({ ...prev, [stepIndex]: true }));
    } catch (error) {
      console.error('Error getting hint:', error);
      toast.error('No hint available for this step');
    }
  };

  const completeIncident = async () => {
    try {
      setIsRunning(false);
      await apiService.completeIncident(attemptId, {
        totalTime: timer,
        finalAnswers: stepAnswers,
        hintsUsed: Object.keys(hints).length
      });
      toast.success('Incident response completed!');
      navigate('/scenarios');
    } catch (error) {
      console.error('Error completing incident:', error);
      toast.error('Failed to complete incident');
    }
  };

  const mockSteps = [
    {
      id: 1,
      title: 'Initial Detection & Alert Triage',
      type: 'detection',
      description: 'Analyze the initial security alert and determine its severity and scope.',
      questions: [
        {
          id: 'alert_type',
          type: 'multiple_choice',
          question: 'What type of security alert was triggered?',
          options: ['SQL Injection', 'Brute Force Attack', 'Phishing Email', 'Malware Detection'],
          correct: 'SQL Injection'
        },
        {
          id: 'severity_assessment',
          type: 'text',
          question: 'Based on the alert details, what is your initial severity assessment and why?'
        }
      ],
      tools: ['SIEM Dashboard', 'Alert Console', 'Network Monitor']
    },
    {
      id: 2,
      title: 'Evidence Collection & Analysis',
      type: 'analysis',
      description: 'Gather and analyze evidence to understand the attack vector and scope.',
      questions: [
        {
          id: 'evidence_sources',
          type: 'checkbox',
          question: 'Which evidence sources should be collected? (Select all that apply)',
          options: ['System logs', 'Network traffic', 'Database logs', 'User activity logs'],
          correct: ['System logs', 'Network traffic', 'Database logs']
        },
        {
          id: 'attack_vector',
          type: 'text',
          question: 'Describe the attack vector used by the attacker based on your analysis.'
        }
      ],
      tools: ['Log Analyzer', 'Wireshark', 'Database Monitor']
    },
    {
      id: 3,
      title: 'Containment Strategy',
      type: 'response',
      description: 'Implement immediate containment measures to prevent further damage.',
      questions: [
        {
          id: 'containment_actions',
          type: 'checkbox',
          question: 'What containment actions should be taken immediately?',
          options: ['Block suspicious IP', 'Disable affected user account', 'Patch vulnerability', 'Monitor traffic'],
          correct: ['Block suspicious IP', 'Disable affected user account']
        },
        {
          id: 'business_impact',
          type: 'text',
          question: 'What is the potential business impact of your containment strategy?'
        }
      ],
      tools: ['Firewall Console', 'User Management', 'Network Isolation']
    },
    {
      id: 4,
      title: 'Eradication & Recovery',
      type: 'recovery',
      description: 'Remove the threat and restore systems to normal operation.',
      questions: [
        {
          id: 'eradication_steps',
          type: 'text',
          question: 'What steps will you take to completely remove the threat from the environment?'
        },
        {
          id: 'recovery_validation',
          type: 'multiple_choice',
          question: 'How will you validate that systems are clean and operational?',
          options: ['Run antivirus scan', 'Monitor network traffic', 'Test application functionality', 'All of the above'],
          correct: 'All of the above'
        }
      ],
      tools: ['System Scanner', 'Application Tester', 'Network Monitor']
    }
  ];

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading incident response interface...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Timer and Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">
              Incident Response: {attempt?.scenario?.title || 'Active Incident'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Follow the incident response methodology to resolve this security incident
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
              <Chip 
                label={`Time: ${formatTime(timer)}`}
                color={isRunning ? "success" : "default"}
                icon={isRunning ? <PlayArrow /> : <Pause />}
              />
              <Button
                onClick={() => setIsRunning(!isRunning)}
                variant="outlined"
                size="small"
              >
                {isRunning ? 'Pause' : 'Resume'}
              </Button>
              <Button
                onClick={completeIncident}
                variant="contained"
                color="success"
                size="small"
                startIcon={<Stop />}
              >
                Complete
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Main Workflow */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
                <Tab label="Workflow" />
                <Tab label="Tools" />
                <Tab label="Evidence" />
              </Tabs>

              {tabValue === 0 && (
                <Box>
                  <Stepper activeStep={currentStep} orientation="vertical">
                    {mockSteps.map((step, index) => (
                      <Step key={step.id}>
                        <StepLabel 
                          icon={index < currentStep ? <CheckCircle /> : <RadioButtonUnchecked />}
                        >
                          <Typography variant="h6">
                            {step.title}
                          </Typography>
                        </StepLabel>
                        <StepContent>
                          <Typography paragraph>
                            {step.description}
                          </Typography>
                          
                          {/* Questions for this step */}
                          {step.questions.map((question, qIndex) => (
                            <Box key={question.id} sx={{ mb: 3 }}>
                              <Typography variant="subtitle1" gutterBottom>
                                {question.question}
                              </Typography>
                              
                              {question.type === 'multiple_choice' && (
                                <FormGroup>
                                  {question.options.map((option) => (
                                    <FormControlLabel
                                      key={option}
                                      control={
                                        <Checkbox
                                          checked={stepAnswers[`${index}_${question.id}`] === option}
                                          onChange={(e) => handleAnswer(index, question.id, option)}
                                        />
                                      }
                                      label={option}
                                    />
                                  ))}
                                </FormGroup>
                              )}
                              
                              {question.type === 'checkbox' && (
                                <FormGroup>
                                  {question.options.map((option) => (
                                    <FormControlLabel
                                      key={option}
                                      control={
                                        <Checkbox
                                          checked={stepAnswers[`${index}_${question.id}`]?.includes(option) || false}
                                          onChange={(e) => {
                                            const current = stepAnswers[`${index}_${question.id}`] || [];
                                            const updated = e.target.checked 
                                              ? [...current, option]
                                              : current.filter(item => item !== option);
                                            handleAnswer(index, question.id, updated);
                                          }}
                                        />
                                      }
                                      label={option}
                                    />
                                  ))}
                                </FormGroup>
                              )}
                              
                              {question.type === 'text' && (
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={3}
                                  variant="outlined"
                                  value={stepAnswers[`${index}_${question.id}`] || ''}
                                  onChange={(e) => handleAnswer(index, question.id, e.target.value)}
                                  placeholder="Enter your detailed response..."
                                />
                              )}
                            </Box>
                          ))}
                          
                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              onClick={() => handleStepComplete(index)}
                              disabled={index !== currentStep}
                              startIcon={<Send />}
                            >
                              Complete Step
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => getHint(index)}
                              startIcon={<HelpOutline />}
                              disabled={hints[index]}
                            >
                              {hints[index] ? 'Hint Used' : 'Get Hint'}
                            </Button>
                          </Box>
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Available Security Tools
                  </Typography>
                  <Grid container spacing={2}>
                    {['SIEM Dashboard', 'Log Analyzer', 'Wireshark', 'Network Scanner', 'Vulnerability Scanner'].map((tool) => (
                      <Grid item xs={12} sm={6} md={4} key={tool}>
                        <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                          <Security color="primary" sx={{ mb: 1 }} />
                          <Typography variant="subtitle1">{tool}</Typography>
                          <Button size="small" sx={{ mt: 1 }}>
                            Launch
                          </Button>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Collected Evidence
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><Assignment /></ListItemIcon>
                      <ListItemText 
                        primary="System Logs" 
                        secondary="Web server access logs showing suspicious requests" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Timeline /></ListItemIcon>
                      <ListItemText 
                        primary="Network Traffic" 
                        secondary="Packet capture showing SQL injection attempts" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Security /></ListItemIcon>
                      <ListItemText 
                        primary="Database Logs" 
                        secondary="Evidence of unauthorized data access" 
                      />
                    </ListItem>
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar with Progress and Alerts */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            {/* Progress Summary */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Progress Summary
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Step {currentStep + 1} of {mockSteps.length}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={((currentStep) / mockSteps.length) * 100} 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Time Elapsed" secondary={formatTime(timer)} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Hints Used" secondary={Object.keys(hints).length} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Steps Completed" secondary={`${currentStep}/${mockSteps.length}`} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Active Alerts */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Active Alerts
                  </Typography>
                  <Alert severity="error" sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      SQL Injection detected on /login endpoint
                    </Typography>
                  </Alert>
                  <Alert severity="warning" sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      Unusual database query patterns observed
                    </Typography>
                  </Alert>
                  <Alert severity="info">
                    <Typography variant="body2">
                      Monitoring systems active and collecting data
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Hint Dialog */}
      <Dialog 
        open={showHintDialog} 
        onClose={() => setShowHintDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <HelpOutline sx={{ mr: 1, verticalAlign: 'middle' }} />
          Hint
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Using hints may reduce your final score.
          </Alert>
          <Typography variant="body1">
            {currentHint}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHintDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncidentResponse;