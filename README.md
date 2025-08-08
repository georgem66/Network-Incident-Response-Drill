Title: Simulated Network Incident Response Drill – Interactive Learning & Assessment Platform

Objective:
Create a full-stack, interactive platform that simulates a small-scale enterprise network environment where controlled cyber incidents can be launched, detected, and resolved. This project should be tailored for a network & security engineering student but reflect professional-grade quality in both functionality and design.

Key Requirements:
	1.	Network Simulation Setup
	•	Simulate an internal corporate network with multiple segments:
	•	Internal LAN with workstations
	•	DMZ with a public-facing web server
	•	A database server with sensitive data
	•	Include simulated network traffic (HTTP, HTTPS, DNS, SSH)
	•	Enable realistic attack scenarios (SQL injection attempt, phishing email with malicious link, brute-force login attempts)
	2.	Incident Scenarios
	•	Provide at least 3 prebuilt incident scenarios with:
	•	Attack vector description
	•	Logs and packet captures
	•	Indicators of compromise (IP addresses, hashes, file changes)
	•	Include both “low severity” and “high severity” cases
	3.	Detection Tools Integration
	•	Integrate open-source security tools like:
	•	Wireshark for packet capture analysis
	•	Suricata or Snort for intrusion detection
	•	Syslog viewer for log correlation
	•	All tools should be accessible via a web dashboard for ease of use
	4.	Incident Response Workflow
	•	A step-by-step guide for students to follow:
	•	Identification: Analyze alerts and logs
	•	Containment: Isolate compromised segments
	•	Eradication: Remove malicious artifacts
	•	Recovery: Restore services securely
	•	Lessons Learned: Summarize findings in a report template
	5.	Gamification & Scoring
	•	Add a scoring system based on:
	•	Speed of incident detection
	•	Accuracy of containment
	•	Correctness of remediation steps
	•	Leaderboard for multiple users
	6.	UI/UX
	•	Professional, responsive dashboard for managing simulations
	•	Real-time incident feed with colored severity indicators
	•	Easy navigation between detection tools, reports, and simulations
	7.	Technical Stack Recommendations
	•	Frontend: React.js or Next.js
	•	Backend: Node.js (Express) or Python (FastAPI)
	•	Database: PostgreSQL for user data, MongoDB for incident metadata
	•	Containerization: Docker to run simulated network environments in isolated containers
	•	Security Best Practices: Use HTTPS, JWT-based authentication, role-based access
	8.	Student-Friendly Features
	•	Include “hint” mode for beginners
	•	Provide educational popups explaining each step in the incident response process
	•	Downloadable PDF report template for completed drills

Deliverables:
	•	Fully functional web application with simulated incidents
	•	Preconfigured Docker containers for network simulation and security tools
	•	Documentation (setup guide + incident response handbook)
	•	Demo data for at least 3 sample incidents

Success Criteria:
	•	Realistic yet safe simulation of network incidents
	•	Engaging learning environment for security students
	•	Easy to extend with new incidents and tools in the future
	•	Clean, professional UI/UX that looks “production ready”
