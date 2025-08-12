# Network Incident Response Drill Platform

## Purpose

The Network Incident Response Drill Platform is a comprehensive training system designed to prepare cybersecurity professionals and IT teams for real-world network security incidents. This platform provides hands-on experience with simulated network attacks, security tool analysis, and incident response procedures in a controlled environment.

The software serves educational institutions, corporate training departments, and cybersecurity teams who need to develop and test their incident response capabilities. Users can practice identifying network threats, analyzing security events, and implementing proper response protocols without risking production systems.

## What This Software Does

This training platform creates realistic network security scenarios where users must:

- Analyze network traffic patterns and identify suspicious activities
- Use integrated security tools to investigate potential threats
- Follow established incident response procedures
- Document findings and response actions
- Compete with other users through scoring and leaderboards

The system includes a web-based interface for managing training scenarios, a backend API for processing user actions, and Docker containers that simulate network environments with actual network traffic and security monitoring tools.

## System Requirements

### Hardware Requirements
- Minimum 4GB RAM (8GB recommended for optimal performance)
- At least 20GB available disk space
- Multi-core processor (2+ cores recommended)
- Stable internet connection for accessing external resources

### Software Requirements
- Docker Engine version 20.0 or higher
- Docker Compose version 2.0 or higher
- Node.js version 16.0 or higher
- PostgreSQL database server (version 12 or higher)
- MongoDB database server (version 4.4 or higher)

### Supported Operating Systems
- Windows 10/11 with Docker Desktop
- macOS with Docker Desktop
- Linux distributions with Docker support (Ubuntu, CentOS, Debian)

### Browser Requirements
- Modern web browser with JavaScript enabled
- Chrome, Firefox, Safari, or Edge (latest versions)
- Minimum 1366x768 screen resolution

## Installation and Setup

### Quick Start with Docker

1. Clone or download the project files to your local machine
2. Open a terminal and navigate to the project directory
3. Start the entire system using Docker Compose:
   ```
   docker-compose up -d
   ```
4. Wait for all services to initialize (this may take several minutes on first run)
5. Access the web interface at http://localhost:3000

### Manual Installation

If you prefer to run components separately:

1. Set up the databases (PostgreSQL and MongoDB)
2. Install Node.js dependencies for the backend:
   ```
   cd backend
   npm install
   ```
3. Install Node.js dependencies for the frontend:
   ```
   cd frontend
   npm install
   ```
4. Configure environment variables in the backend/.env file
5. Start the backend server:
   ```
   cd backend
   npm start
   ```
6. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

## Using the Platform

### For Students and Trainees

1. Register for an account through the web interface
2. Log in and browse available training scenarios
3. Select a scenario that matches your skill level
4. Follow the on-screen instructions to begin the drill
5. Use the provided tools to analyze network data and identify threats
6. Submit your findings and response actions
7. Review your score and compare with other participants

### For Instructors and Administrators

1. Access the administrative dashboard after logging in
2. Create new training scenarios or modify existing ones
3. Monitor student progress and performance
4. Review completed drills and provide feedback
5. Generate reports on user performance and system usage
6. Configure system settings and user permissions

## Configuration

The platform uses environment variables for configuration. Key settings include:

- Database connection strings for PostgreSQL and MongoDB
- JWT secret keys for user authentication
- API endpoint URLs for frontend-backend communication
- Docker network configurations for simulated environments
- Log levels and file locations

Configuration files are located in the backend/config directory and should be reviewed before deployment in production environments.

## Support and Troubleshooting

### Common Issues

If the web interface is not accessible, verify that all Docker containers are running and that port 3000 is not in use by other applications.

Database connection errors typically indicate that PostgreSQL or MongoDB services are not properly started or configured.

Performance issues may occur if system resources are insufficient. Monitor CPU and memory usage during training sessions.

### Getting Help

For technical support or questions about using the platform, check the system logs for error messages that can help identify the root cause of issues.

When reporting problems, include information about your operating system, Docker version, and any error messages displayed in the browser or terminal.

## Security Considerations

This platform is designed for training purposes and should not be deployed on production networks without proper security review. The simulated network environments may contain intentionally vulnerable components that could pose security risks if exposed to external networks.

Always run the training platform in isolated network segments and ensure that Docker containers cannot access sensitive production systems or data.

Regular updates to the underlying Docker images and Node.js dependencies are recommended to address security vulnerabilities in third-party components.
