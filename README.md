# Network Incident Response Drill Platform

A comprehensive interactive platform for network security incident response training, designed for network & security engineering students.

## Features

- 🌐 **Network Simulation**: Simulated corporate network with multiple segments (Internal LAN, DMZ, Database servers)
- 🎯 **Incident Scenarios**: Pre-built incident scenarios with attack vectors, logs, and packet captures
- 🔍 **Detection Tools**: Integrated Wireshark, Suricata IDS, and Syslog viewer via web dashboard
- 📋 **Incident Response Workflow**: Step-by-step guided process for incident handling
- 🏆 **Gamification**: Scoring system with leaderboards based on response speed and accuracy
- 🎓 **Educational Features**: Hint mode and educational popups for learning support
- 📊 **Professional UI**: Responsive dashboard with real-time incident monitoring

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 16+ (for development)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/georgem66/Network-Incident-Response-Drill.git
cd Network-Incident-Response-Drill
```

2. Start the platform:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Network Simulation: http://localhost:8080

### Development Setup

1. Install dependencies:
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

2. Run in development mode:
```bash
# Start databases
docker-compose up postgres mongodb redis -d

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm start
```

## Architecture

### Technology Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Node.js with Express.js
- **Databases**: PostgreSQL (user data) + MongoDB (incident metadata)
- **Security**: JWT authentication, bcrypt password hashing
- **Containerization**: Docker for network simulation and tool isolation
- **Monitoring**: Suricata IDS, simulated Wireshark analysis

### Project Structure

```
├── frontend/           # React.js application
├── backend/           # Node.js API server
├── docker/           # Docker configurations
│   ├── network-sim/  # Network simulation environment
│   └── suricata/     # IDS configuration
├── docs/             # Documentation
├── scenarios/        # Incident scenario definitions
└── docker-compose.yml
```

## Incident Scenarios

The platform includes three pre-configured incident scenarios:

1. **SQL Injection Attack** (High Severity)
   - Attack against web application database
   - Complete packet captures and logs
   - Step-by-step remediation guide

2. **Phishing Email Campaign** (Medium Severity)
   - Email-based attack with malicious links
   - Network traffic analysis required
   - User awareness training component

3. **Brute Force Login Attempts** (Low Severity)
   - Automated login attempts against SSH service
   - Log analysis and IP blocking exercise
   - Rate limiting implementation

## Usage

### For Students

1. **Register/Login**: Create an account and access the dashboard
2. **Select Scenario**: Choose from available incident scenarios
3. **Analyze**: Use integrated tools to investigate the incident
4. **Respond**: Follow the incident response workflow
5. **Learn**: Review educational materials and hints
6. **Score**: Track progress on the leaderboard

### For Instructors

1. **Create Scenarios**: Define custom incident scenarios
2. **Monitor Progress**: Track student performance and engagement
3. **Generate Reports**: Export detailed analysis reports
4. **Manage Users**: User and role management capabilities

## API Documentation

The backend API provides endpoints for:

- User authentication and management
- Incident scenario management
- Tool integration and data access
- Scoring and progress tracking
- Real-time notifications

API documentation is available at http://localhost:3001/api-docs when running.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

This platform is designed for educational purposes in controlled environments. Default credentials and configurations should be changed for any production-like usage.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the incident response handbook

## Acknowledgments

- Built with educational security tools and frameworks
- Inspired by real-world incident response methodologies
- Designed for hands-on cybersecurity learning