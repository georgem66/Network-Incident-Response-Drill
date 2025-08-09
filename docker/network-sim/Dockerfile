FROM nginx:alpine

# Install additional packages for network simulation
RUN apk add --no-cache \
    tcpdump \
    netcat-openbsd \
    curl \
    python3 \
    py3-pip

# Create simulation directories
RUN mkdir -p /var/log/simulation /var/lib/pcaps /usr/share/nginx/html/simulation

# Copy simulation web content
COPY html/ /usr/share/nginx/html/
COPY scripts/ /usr/local/bin/
COPY logs/ /var/log/simulation/
COPY pcaps/ /var/lib/pcaps/

# Make scripts executable
RUN chmod +x /usr/local/bin/*.sh

# Expose ports
EXPOSE 80 443 22

# Start services
CMD ["sh", "-c", "/usr/local/bin/start-simulation.sh && nginx -g 'daemon off;'"]