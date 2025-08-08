// Initialize MongoDB for Network Incident Response Drill Platform
// This script sets up the initial collections and indexes

// Use the incidents database
db = db.getSiblingDB('incidents');

// Create scenarios collection
db.createCollection('scenarios');

// Create incidents collection
db.createCollection('incidents');

// Create logs collection
db.createCollection('logs');

// Create network_traffic collection
db.createCollection('network_traffic');

// Create alerts collection
db.createCollection('alerts');

// Insert sample scenarios
db.scenarios.insertMany([
  {
    _id: 'sql_injection_attack',
    title: 'SQL Injection Attack on Web Application',
    description: 'A malicious actor is attempting to exploit SQL injection vulnerabilities in the company web application to access sensitive customer data.',
    severity: 'high',
    category: 'web_application_attack',
    learning_objectives: [
      'Identify SQL injection attack patterns in web application logs',
      'Analyze database query logs for malicious activities',
      'Implement proper input validation and parameterized queries',
      'Coordinate incident response across web and database teams'
    ],
    attack_vector: {
      type: 'SQL Injection',
      target: 'Web Application Database',
      method: 'POST parameter manipulation',
      initial_access: '2024-01-15T10:30:00Z'
    },
    indicators_of_compromise: {
      ip_addresses: ['192.168.1.100', '10.0.0.15'],
      suspicious_queries: [
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM admin_users --",
        "' OR '1'='1"
      ],
      file_hashes: [],
      domains: ['malicious-site.com'],
      user_agents: ['Mozilla/5.0 (compatible; SQLMap/1.0)']
    },
    timeline: [
      {
        timestamp: '2024-01-15T10:30:00Z',
        event: 'Initial SQL injection attempt detected',
        source: 'Web Application Firewall'
      },
      {
        timestamp: '2024-01-15T10:35:00Z',
        event: 'Multiple failed login attempts with SQL payloads',
        source: 'Application Logs'
      },
      {
        timestamp: '2024-01-15T10:40:00Z',
        event: 'Successful data extraction from users table',
        source: 'Database Logs'
      }
    ],
    network_topology: {
      segments: ['dmz', 'database_tier'],
      affected_hosts: ['web-server-01', 'db-server-01']
    },
    response_steps: {
      identification: {
        tasks: [
          'Review web application logs for suspicious patterns',
          'Analyze database query logs',
          'Check WAF alerts and blocked requests',
          'Identify affected database tables'
        ],
        hints: [
          'Look for unusual SQL keywords in request parameters',
          'Check for successful queries that returned unexpected data',
          'Review authentication bypass attempts'
        ]
      },
      containment: {
        tasks: [
          'Block attacking IP addresses at firewall level',
          'Disable affected database user accounts',
          'Enable additional WAF rules for SQL injection',
          'Isolate affected web application servers'
        ],
        hints: [
          'Implement emergency firewall rules',
          'Consider taking the web application offline temporarily',
          'Preserve evidence before making changes'
        ]
      },
      eradication: {
        tasks: [
          'Patch SQL injection vulnerabilities in application code',
          'Implement parameterized queries',
          'Update web application to latest security version',
          'Remove any backdoors or persistent access'
        ],
        hints: [
          'Review all database interaction code',
          'Implement input validation and sanitization',
          'Consider using ORM frameworks for database access'
        ]
      },
      recovery: {
        tasks: [
          'Restore database from clean backup if necessary',
          'Gradually restore web application services',
          'Monitor for continued attack attempts',
          'Verify data integrity'
        ],
        hints: [
          'Test application functionality thoroughly',
          'Monitor database performance post-recovery',
          'Implement additional monitoring for SQL injection attempts'
        ]
      },
      lessons_learned: {
        tasks: [
          'Document attack methodology and impact',
          'Review security development practices',
          'Update incident response procedures',
          'Provide developer training on secure coding'
        ],
        hints: [
          'Create a post-incident report',
          'Update security policies and procedures',
          'Schedule regular security code reviews'
        ]
      }
    },
    scoring_criteria: {
      speed_bonus: 25,
      accuracy_weight: 40,
      completeness_weight: 35,
      penalty_per_hint: 2
    },
    estimated_completion_time: 45, // minutes
    difficulty_level: 'intermediate',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: 'phishing_campaign',
    title: 'Spear Phishing Email Campaign',
    description: 'Employees are receiving targeted phishing emails with malicious attachments designed to install ransomware on corporate workstations.',
    severity: 'medium',
    category: 'social_engineering',
    learning_objectives: [
      'Identify phishing email characteristics and indicators',
      'Analyze email headers and attachment properties',
      'Coordinate response across IT and HR departments',
      'Implement user awareness and training programs'
    ],
    attack_vector: {
      type: 'Spear Phishing',
      target: 'Corporate Workstations',
      method: 'Malicious email attachments',
      initial_access: '2024-01-20T09:15:00Z'
    },
    indicators_of_compromise: {
      ip_addresses: ['203.0.113.45', '198.51.100.67'],
      suspicious_queries: [],
      file_hashes: [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'f1e2d3c4b5a6987654321098765432109876fedc'
      ],
      domains: ['secure-corporate-update.net', 'hr-benefits-2024.org'],
      user_agents: []
    },
    timeline: [
      {
        timestamp: '2024-01-20T09:15:00Z',
        event: 'First phishing email sent to HR department',
        source: 'Email Security Gateway'
      },
      {
        timestamp: '2024-01-20T09:45:00Z',
        event: 'Employee clicked malicious link',
        source: 'Web Proxy Logs'
      },
      {
        timestamp: '2024-01-20T10:00:00Z',
        event: 'Malicious payload downloaded',
        source: 'Endpoint Detection and Response'
      }
    ],
    network_topology: {
      segments: ['corporate_lan'],
      affected_hosts: ['workstation-05', 'workstation-12', 'workstation-23']
    },
    response_steps: {
      identification: {
        tasks: [
          'Analyze phishing email headers and content',
          'Check email security gateway logs',
          'Identify users who received the emails',
          'Scan for similar emails in mail queues'
        ],
        hints: [
          'Look for suspicious sender addresses and domains',
          'Check for urgent or threatening language',
          'Verify attachment file types and sizes'
        ]
      },
      containment: {
        tasks: [
          'Quarantine remaining phishing emails',
          'Disable affected user accounts temporarily',
          'Block malicious domains at DNS level',
          'Isolate potentially infected workstations'
        ],
        hints: [
          'Work with email administrators to remove emails',
          'Check for lateral movement from infected systems',
          'Implement emergency URL filtering rules'
        ]
      },
      eradication: {
        tasks: [
          'Remove malicious attachments from systems',
          'Run full antivirus scans on affected workstations',
          'Reset passwords for compromised accounts',
          'Update email security rules'
        ],
        hints: [
          'Use specialized malware removal tools',
          'Consider reimaging heavily infected systems',
          'Update email security policies'
        ]
      },
      recovery: {
        tasks: [
          'Restore user access gradually',
          'Monitor for continued phishing attempts',
          'Verify system integrity and functionality',
          'Update user training materials'
        ],
        hints: [
          'Implement additional email monitoring',
          'Test restored systems thoroughly',
          'Schedule immediate security awareness training'
        ]
      },
      lessons_learned: {
        tasks: [
          'Document phishing campaign tactics',
          'Review email security effectiveness',
          'Update security awareness training',
          'Improve incident response coordination'
        ],
        hints: [
          'Create phishing simulation exercises',
          'Update email security technologies',
          'Establish clear escalation procedures'
        ]
      }
    },
    scoring_criteria: {
      speed_bonus: 20,
      accuracy_weight: 35,
      completeness_weight: 40,
      penalty_per_hint: 1.5
    },
    estimated_completion_time: 35, // minutes
    difficulty_level: 'beginner',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: 'brute_force_ssh',
    title: 'SSH Brute Force Attack',
    description: 'Multiple automated login attempts are being made against SSH services on critical servers, potentially compromising administrative access.',
    severity: 'low',
    category: 'brute_force',
    learning_objectives: [
      'Identify brute force attack patterns in authentication logs',
      'Implement account lockout and rate limiting policies',
      'Configure intrusion detection for authentication events',
      'Establish secure remote access procedures'
    ],
    attack_vector: {
      type: 'Brute Force',
      target: 'SSH Services',
      method: 'Automated credential guessing',
      initial_access: '2024-01-25T14:20:00Z'
    },
    indicators_of_compromise: {
      ip_addresses: ['185.220.100.241', '185.220.101.32', '185.220.102.15'],
      suspicious_queries: [],
      file_hashes: [],
      domains: [],
      user_agents: []
    },
    timeline: [
      {
        timestamp: '2024-01-25T14:20:00Z',
        event: 'High volume of SSH connection attempts detected',
        source: 'System Authentication Logs'
      },
      {
        timestamp: '2024-01-25T14:25:00Z',
        event: 'Multiple failed logins for admin accounts',
        source: 'SSH Daemon Logs'
      },
      {
        timestamp: '2024-01-25T14:30:00Z',
        event: 'Intrusion detection system triggered',
        source: 'Fail2ban'
      }
    ],
    network_topology: {
      segments: ['dmz', 'management'],
      affected_hosts: ['ssh-gateway-01', 'admin-server-01', 'backup-server-01']
    },
    response_steps: {
      identification: {
        tasks: [
          'Analyze SSH authentication logs',
          'Identify source IP addresses and patterns',
          'Review attempted usernames and timing',
          'Check for any successful authentications'
        ],
        hints: [
          'Look for repeated failed login attempts',
          'Check for patterns in timing and source IPs',
          'Review commonly attempted usernames'
        ]
      },
      containment: {
        tasks: [
          'Block attacking IP addresses at firewall',
          'Enable account lockout policies',
          'Implement SSH connection rate limiting',
          'Temporarily disable unnecessary SSH services'
        ],
        hints: [
          'Use fail2ban or similar tools for automatic blocking',
          'Consider changing default SSH ports',
          'Implement connection throttling'
        ]
      },
      eradication: {
        tasks: [
          'Update SSH configuration for security',
          'Disable password authentication where possible',
          'Implement key-based authentication',
          'Remove or secure default accounts'
        ],
        hints: [
          'Configure SSH to use only strong authentication methods',
          'Disable root login via SSH',
          'Implement multi-factor authentication'
        ]
      },
      recovery: {
        tasks: [
          'Verify SSH service functionality',
          'Test legitimate user access',
          'Monitor for continued attack attempts',
          'Document new security configurations'
        ],
        hints: [
          'Test SSH access from trusted networks',
          'Verify backup access methods',
          'Monitor authentication success rates'
        ]
      },
      lessons_learned: {
        tasks: [
          'Review SSH security best practices',
          'Update system hardening procedures',
          'Improve monitoring and alerting',
          'Train staff on secure remote access'
        ],
        hints: [
          'Create SSH security checklist',
          'Implement automated security scanning',
          'Establish regular security reviews'
        ]
      }
    },
    scoring_criteria: {
      speed_bonus: 15,
      accuracy_weight: 30,
      completeness_weight: 50,
      penalty_per_hint: 1
    },
    estimated_completion_time: 25, // minutes
    difficulty_level: 'beginner',
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// Create indexes for better performance
db.scenarios.createIndex({ "severity": 1 });
db.scenarios.createIndex({ "category": 1 });
db.scenarios.createIndex({ "difficulty_level": 1 });

db.incidents.createIndex({ "scenario_id": 1 });
db.incidents.createIndex({ "user_id": 1 });
db.incidents.createIndex({ "timestamp": -1 });

db.logs.createIndex({ "incident_id": 1 });
db.logs.createIndex({ "timestamp": -1 });
db.logs.createIndex({ "source": 1 });

db.network_traffic.createIndex({ "incident_id": 1 });
db.network_traffic.createIndex({ "timestamp": -1 });
db.network_traffic.createIndex({ "src_ip": 1 });
db.network_traffic.createIndex({ "dst_ip": 1 });

db.alerts.createIndex({ "incident_id": 1 });
db.alerts.createIndex({ "severity": 1 });
db.alerts.createIndex({ "timestamp": -1 });

print("MongoDB initialization completed successfully!");