const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join user to their own room for personalized updates
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join scenario room for scenario-specific updates
    socket.on('join_scenario', (scenarioId) => {
      socket.join(`scenario_${scenarioId}`);
      console.log(`User joined scenario ${scenarioId} room`);
    });

    // Handle incident updates
    socket.on('incident_update', (data) => {
      // Broadcast to scenario room
      socket.to(`scenario_${data.scenarioId}`).emit('incident_alert', {
        type: 'new_incident',
        data: data,
        timestamp: new Date().toISOString()
      });
    });

    // Handle step completion
    socket.on('step_completed', (data) => {
      // Notify user's room about progress
      io.to(`user_${data.userId}`).emit('progress_update', {
        type: 'step_completed',
        step: data.step,
        score: data.score,
        timestamp: new Date().toISOString()
      });
    });

    // Handle real-time alerts
    socket.on('security_alert', (alert) => {
      // Broadcast security alerts to all connected users
      io.emit('security_alert', {
        ...alert,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  // Simulate real-time security events
  const simulateSecurityEvents = () => {
    const events = [
      {
        type: 'network_anomaly',
        severity: 'medium',
        message: 'Unusual network traffic detected from 192.168.1.100',
        source: 'Network Monitor'
      },
      {
        type: 'failed_login',
        severity: 'low',
        message: 'Multiple failed login attempts detected',
        source: 'Authentication System'
      },
      {
        type: 'malware_detected',
        severity: 'high',
        message: 'Potential malware detected on workstation-05',
        source: 'Endpoint Protection'
      }
    ];

    setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      io.emit('real_time_alert', {
        ...randomEvent,
        id: Date.now(),
        timestamp: new Date().toISOString()
      });
    }, 30000); // Every 30 seconds
  };

  // Start simulating events
  simulateSecurityEvents();
};

module.exports = socketHandler;