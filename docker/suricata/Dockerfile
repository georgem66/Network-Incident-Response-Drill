FROM jasonish/suricata:latest

# Create configuration directories
RUN mkdir -p /etc/suricata/rules /var/log/suricata

# Copy custom Suricata configuration
COPY suricata.yaml /etc/suricata/
COPY rules/ /etc/suricata/rules/

# Create startup script
RUN echo '#!/bin/bash' > /start-suricata.sh && \
    echo 'suricata -c /etc/suricata/suricata.yaml -i eth0 --init-errors-fatal' >> /start-suricata.sh && \
    chmod +x /start-suricata.sh

CMD ["/start-suricata.sh"]