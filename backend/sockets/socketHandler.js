const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
    });
    socket.on('join_scenario', (scenarioId) => {
      socket.join(`scenario_${scenarioId}`);
      console.log(`User joined scenario ${scenarioId} room`);
    });
    socket.on('incident_update', (data) => {
      socket.to(`scenario_${data.scenarioId}`).emit('incident_alert', {
        type: 'new_incident',
        data: data,
        timestamp: new Date().toISOString()
      });
    });
    socket.on('step_completed', (data) => {
      io.to(`user_${data.userId}`).emit('progress_update', {
        type: 'step_completed',
        step: data.step,
        score: data.score,
        timestamp: new Date().toISOString()
      });
    });
    socket.on('security_alert', (alert) => {
      io.emit('security_alert', {
        ...alert,
        timestamp: new Date().toISOString()
      });
    });
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
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
  simulateSecurityEvents();
};
module.exports = socketHandler;