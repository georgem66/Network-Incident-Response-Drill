import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, Box, Grid, Card, CardContent, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, Chip, LinearProgress, Tabs, Tab
} from '@mui/material';
import {
  EmojiEvents, TrendingUp, Speed, CheckCircle,
  WorkspacePremium, LocalFireDepartment, Timer
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const Leaderboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    loadLeaderboardData();
  }, [tabValue]);

  const loadLeaderboardData = async () => {
    try {
      // Mock data
      setLeaderboardData([
        {
          id: 1,
          username: 'SecurityPro',
          rank: 1,
          totalScore: 2850,
          scenariosCompleted: 15,
          accuracy: 94,
          level: 'Advanced'
        }
      ]);

      setAchievements([
        {
          id: 1,
          name: 'First Steps',
          description: 'Complete your first scenario',
          icon: '🎯',
          earned: true,
          points: 50
        }
      ]);

      setUserStats({
        currentRank: 15,
        totalScore: 1850,
        level: 'Intermediate',
        nextLevelPoints: 2000,
        scenariosCompleted: 8,
        avgAccuracy: 82
      });
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast.error('Failed to load leaderboard data');
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <EmojiEvents sx={{ color: 'gold' }} />;
    if (rank === 2) return <EmojiEvents sx={{ color: 'silver' }} />;
    if (rank === 3) return <EmojiEvents sx={{ color: '#CD7F32' }} />;
    return rank;
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'info';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'success';
      case 'Expert': return 'error';
      default: return 'default';
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          <EmojiEvents sx={{ mr: 1, verticalAlign: 'middle' }} />
          Leaderboard & Achievements
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your progress, compete with peers, and unlock achievements
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                      <Typography variant="h4">U</Typography>
                    </Avatar>
                    <Typography variant="h6">Your Rank</Typography>
                    <Typography variant="h4" color="primary">
                      #{userStats?.currentRank}
                    </Typography>
                    <Chip 
                      label={userStats?.level} 
                      color={getLevelColor(userStats?.level)}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <TrendingUp color="primary" sx={{ fontSize: 30, mb: 1 }} />
                        <Typography variant="h6">{userStats?.totalScore}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Score
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <CheckCircle color="success" sx={{ fontSize: 30, mb: 1 }} />
                        <Typography variant="h6">{userStats?.scenariosCompleted}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Scenarios Completed
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Speed color="info" sx={{ fontSize: 30, mb: 1 }} />
                        <Typography variant="h6">{userStats?.avgAccuracy}%</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Avg Accuracy
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <LocalFireDepartment color="warning" sx={{ fontSize: 30, mb: 1 }} />
                        <Typography variant="h6">3</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Current Streak
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Progress to Next Level
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={userStats ? (userStats.totalScore / userStats.nextLevelPoints) * 100 : 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {userStats?.totalScore} / {userStats?.nextLevelPoints} points
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab icon={<EmojiEvents />} label="Overall Rankings" />
              <Tab icon={<Timer />} label="This Week" />
              <Tab icon={<WorkspacePremium />} label="Achievements" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Performers
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Level</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Scenarios</TableCell>
                        <TableCell>Accuracy</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaderboardData.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getRankIcon(user.rank)}
                              <Typography variant="h6" sx={{ ml: 1 }}>
                                {user.rank}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                {user.username[0]}
                              </Avatar>
                              <Typography variant="subtitle2">
                                {user.username}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={user.level} 
                              color={getLevelColor(user.level)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6" color="primary">
                              {user.totalScore.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>{user.scenariosCompleted}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2">
                                {user.accuracy}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={user.accuracy}
                                sx={{ ml: 1, width: 50, height: 4 }}
                              />
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Weekly Champions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Top performers this week
                </Typography>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Your Achievements
                </Typography>
                <Grid container spacing={2}>
                  {achievements.map((achievement) => (
                    <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                      <Card 
                        variant="outlined"
                        sx={{ 
                          opacity: achievement.earned ? 1 : 0.6,
                          textAlign: 'center'
                        }}
                      >
                        <CardContent>
                          <Typography variant="h3" sx={{ mb: 1 }}>
                            {achievement.icon}
                          </Typography>
                          <Typography variant="h6" gutterBottom>
                            {achievement.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {achievement.description}
                          </Typography>
                          <Chip 
                            label={`${achievement.points} pts`}
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Leaderboard;