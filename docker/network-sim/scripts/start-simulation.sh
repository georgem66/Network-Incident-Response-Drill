#!/bin/sh

echo "Starting Network Simulation Environment..."

# Start network traffic generation
echo "Generating simulated network traffic..."

# Create some sample logs
cat > /var/log/simulation/web_access.log << EOF
192.168.1.100 - - [$(date)] "POST /login.php HTTP/1.1" 200 1234 "http://webapp.local/" "Mozilla/5.0"
192.168.1.100 - - [$(date)] "POST /search.php HTTP/1.1" 200 567 "http://webapp.local/" "Mozilla/5.0"
192.168.1.15 - - [$(date)] "GET /index.html HTTP/1.1" 200 2048 "-" "Mozilla/5.0"
EOF

cat > /var/log/simulation/auth.log << EOF
$(date) ssh-gateway-01 sshd[1234]: Failed password for root from 185.220.100.241 port 55892 ssh2
$(date) ssh-gateway-01 sshd[1235]: Failed password for admin from 185.220.100.241 port 55893 ssh2
$(date) webapp-server-01 nginx: Multiple failed authentication attempts from 192.168.1.100
EOF

echo "Network simulation started successfully"