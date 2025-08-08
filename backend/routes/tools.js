const express = require('express');

const router = express.Router();

/**
 * @swagger
 * /api/tools/wireshark:
 *   get:
 *     summary: Get simulated Wireshark packet captures
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: scenario
 *         schema:
 *           type: string
 *         description: Scenario ID to filter packets
 *     responses:
 *       200:
 *         description: Packet captures retrieved successfully
 */
router.get('/wireshark', async (req, res, next) => {
  try {
    const { scenario } = req.query;
    
    // Simulated packet capture data
    const packets = [
      {
        id: 1,
        timestamp: '2024-01-15T10:30:15.123Z',
        source: '192.168.1.100',
        destination: '192.168.1.10',
        protocol: 'HTTP',
        length: 542,
        info: 'POST /login.php HTTP/1.1',
        data: "POST /login.php HTTP/1.1\nHost: webapp.local\nContent-Type: application/x-www-form-urlencoded\nContent-Length: 45\n\nusername=admin'--&password=test"
      },
      {
        id: 2,
        timestamp: '2024-01-15T10:30:16.456Z',
        source: '192.168.1.10',
        destination: '192.168.1.100',
        protocol: 'HTTP',
        length: 1240,
        info: 'HTTP/1.1 200 OK',
        data: "HTTP/1.1 200 OK\nContent-Type: text/html\nContent-Length: 1024\n\n<html><body>Welcome admin</body></html>"
      },
      {
        id: 3,
        timestamp: '2024-01-15T10:30:17.789Z',
        source: '192.168.1.100',
        destination: '192.168.1.10',
        protocol: 'HTTP',
        length: 312,
        info: 'POST /search.php HTTP/1.1',
        data: "POST /search.php HTTP/1.1\nHost: webapp.local\nContent-Type: application/x-www-form-urlencoded\n\nsearch=' UNION SELECT username,password FROM users--"
      }
    ];

    res.json({
      success: true,
      data: {
        packets,
        total: packets.length,
        scenario: scenario || 'all'
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tools/suricata:
 *   get:
 *     summary: Get Suricata IDS alerts
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: IDS alerts retrieved successfully
 */
router.get('/suricata', async (req, res, next) => {
  try {
    const alerts = [
      {
        id: 1,
        timestamp: '2024-01-15T10:30:15Z',
        severity: 'high',
        signature: 'ET WEB_APPLICATION SQL Injection Attack',
        source_ip: '192.168.1.100',
        dest_ip: '192.168.1.10',
        protocol: 'TCP',
        port: 80,
        message: 'Possible SQL injection attack detected in HTTP POST data'
      },
      {
        id: 2,
        timestamp: '2024-01-15T10:30:17Z',
        severity: 'high',
        signature: 'ET WEB_APPLICATION SQL Injection UNION Attack',
        source_ip: '192.168.1.100',
        dest_ip: '192.168.1.10',
        protocol: 'TCP',
        port: 80,
        message: 'SQL UNION injection attempt detected'
      },
      {
        id: 3,
        timestamp: '2024-01-20T09:45:12Z',
        severity: 'medium',
        signature: 'ET POLICY HTTP Suspicious User-Agent',
        source_ip: '203.0.113.45',
        dest_ip: '192.168.1.15',
        protocol: 'TCP',
        port: 80,
        message: 'Suspicious user agent string detected'
      }
    ];

    res.json({
      success: true,
      data: {
        alerts,
        total: alerts.length
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tools/syslog:
 *   get:
 *     summary: Get system logs
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [error, warn, info, debug]
 *         description: Log level filter
 *     responses:
 *       200:
 *         description: System logs retrieved successfully
 */
router.get('/syslog', async (req, res, next) => {
  try {
    const { level } = req.query;
    
    let logs = [
      {
        id: 1,
        timestamp: '2024-01-15T10:30:14Z',
        level: 'error',
        host: 'webapp-server-01',
        service: 'nginx',
        message: 'Multiple failed authentication attempts from 192.168.1.100'
      },
      {
        id: 2,
        timestamp: '2024-01-15T10:30:15Z',
        level: 'warn',
        host: 'database-server-01',
        service: 'mysql',
        message: 'Unusual query pattern detected: SELECT * FROM users WHERE username=\'admin\'--\''
      },
      {
        id: 3,
        timestamp: '2024-01-15T10:30:16Z',
        level: 'error',
        host: 'webapp-server-01',
        service: 'php-fpm',
        message: 'SQL error: Table \'users\' doesn\'t exist'
      },
      {
        id: 4,
        timestamp: '2024-01-20T09:45:10Z',
        level: 'info',
        host: 'mail-server-01',
        service: 'postfix',
        message: 'New message from external sender: noreply@secure-corporate-update.net'
      },
      {
        id: 5,
        timestamp: '2024-01-25T14:20:05Z',
        level: 'warn',
        host: 'ssh-gateway-01',
        service: 'sshd',
        message: 'Failed password for root from 185.220.100.241 port 55892 ssh2'
      }
    ];

    if (level) {
      logs = logs.filter(log => log.level === level);
    }

    res.json({
      success: true,
      data: {
        logs,
        total: logs.length,
        filter: { level }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;