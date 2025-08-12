import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow,
  Info,
  Schedule,
  TrendingUp,
  FilterList,
  Search,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { scenarioService } from '../../services/api';
const Scenarios = () => {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [filteredScenarios, setFilteredScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    severity: '',
    difficulty: '',
    category: '',
  });
  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await scenarioService.getAll();
        setScenarios(response.data.scenarios);
        setFilteredScenarios(response.data.scenarios);
      } catch (error) {
        console.error('Failed to fetch scenarios:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScenarios();
  }, []);
  useEffect(() => {
    let filtered = scenarios;
    if (filters.search) {
      filtered = filtered.filter(scenario =>
        scenario.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        scenario.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.severity) {
      filtered = filtered.filter(scenario => scenario.severity === filters.severity);
    }
    if (filters.difficulty) {
      filtered = filtered.filter(scenario => scenario.difficultyLevel === filters.difficulty);
    }
    if (filters.category) {
      filtered = filtered.filter(scenario => scenario.category === filters.category);
    }
    setFilteredScenarios(filtered);
  }, [scenarios, filters]);
  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };
  const clearFilters = () => {
    setFilters({
      search: '',
      severity: '',
      difficulty: '',
      category: '',
    });
  };
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
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'advanced':
        return 'error';
      case 'intermediate':
        return 'warning';
      case 'beginner':
        return 'success';
      default:
        return 'default';
    }
  };
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'web_application_attack':
        return '🌐';
      case 'social_engineering':
        return '📧';
      case 'brute_force':
        return '🔐';
      default:
        return '⚠️';
    }
  };
  if (loading) {
    return (
      <Box>
        <Typography>Loading scenarios...</Typography>
      </Box>
    );
  }
  return (
    <Box>
      {}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Training Scenarios
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose from our collection of realistic incident response scenarios. Each scenario is designed 
          to teach you critical cybersecurity skills through hands-on practice.
        </Typography>
      </Paper>
      {}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search scenarios..."
              variant="outlined"
              size="small"
              value={filters.search}
              onChange={handleFilterChange('search')}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Severity</InputLabel>
              <Select
                value={filters.severity}
                label="Severity"
                onChange={handleFilterChange('severity')}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={filters.difficulty}
                label="Difficulty"
                onChange={handleFilterChange('difficulty')}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={handleFilterChange('category')}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="web_application_attack">Web Application</MenuItem>
                <MenuItem value="social_engineering">Social Engineering</MenuItem>
                <MenuItem value="brute_force">Brute Force</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              variant="outlined"
              onClick={clearFilters}
              startIcon={<FilterList />}
              fullWidth
            >
              Clear
            </Button>
          </Grid>
        </Grid>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Showing {filteredScenarios.length} of {scenarios.length} scenarios
        </Typography>
      </Paper>
      {}
      <Grid container spacing={3}>
        {filteredScenarios.map((scenario) => (
          <Grid item xs={12} md={6} lg={4} key={scenario._id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h2" sx={{ mr: 1, fontSize: '2rem' }}>
                    {getCategoryIcon(scenario.category)}
                  </Typography>
                  <Box>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {scenario.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={scenario.severity} 
                        color={getSeverityColor(scenario.severity)}
                        size="small"
                      />
                      <Chip 
                        label={scenario.difficultyLevel} 
                        color={getDifficultyColor(scenario.difficultyLevel)}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {scenario.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {scenario.estimatedCompletionTime} min
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {scenario.learningObjectives?.length || 0} objectives
                    </Typography>
                  </Box>
                </Box>
                {scenario.learningObjectives && scenario.learningObjectives.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Learning Objectives:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mt: 0.5, mb: 0 }}>
                      {scenario.learningObjectives.slice(0, 2).map((objective, index) => (
                        <Typography
                          key={index}
                          component="li"
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          {objective}
                        </Typography>
                      ))}
                      {scenario.learningObjectives.length > 2 && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          +{scenario.learningObjectives.length - 2} more...
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  startIcon={<Info />}
                  onClick={() => navigate(`/scenarios/${scenario._id}`)}
                  sx={{ mr: 1 }}
                >
                  Details
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PlayArrow />}
                  onClick={() => navigate(`/scenarios/${scenario._id}`)}
                  sx={{ ml: 'auto' }}
                >
                  Start Training
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {filteredScenarios.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No scenarios found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters to see more results.
          </Typography>
          <Button
            variant="outlined"
            onClick={clearFilters}
            sx={{ mt: 2 }}
          >
            Clear Filters
          </Button>
        </Paper>
      )}
    </Box>
  );
};
export default Scenarios;