import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, Box, Grid, Card, Tabs, Tab,
  Button, List, ListItem, ListItemText, ListItemIcon,
  TextField, InputAdornment, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Accordion,
  AccordionSummary, AccordionDetails, FormControl, InputLabel,
  Select, MenuItem, Switch, FormControlLabel, Divider
} from '@mui/material';
import {
  Security, NetworkCheck, Storage, Search, FilterList,
  Download, PlayArrow, Stop, Refresh, ExpandMore, Visibility, Launch
} from '@mui/icons-material';
import toast from 'react-hot-toast';
const Tools = () => {
  const [tabValue, setTabValue] = useState(0);
  const [suricataAlerts, setSuricataAlerts] = useState([]);
  const [packetData, setPacketData] = useState([]);
  const [syslogData, setSyslogData] = useState([]);
  const [filters, setFilters] = useState({
    suricata: { severity: 'all', category: 'all' },
    wireshark: { protocol: 'all', src: '', dst: '' },
    syslog: { level: 'all', source: 'all', search: '' }
  });
  const [loading] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [captureRunning, setCaptureRunning] = useState(false);
  const loadToolData = async () => {
    try {
      switch (tabValue) {
        case 0:
          await loadSuricataData();
          break;
        case 1:
          await loadWiresharkData();
          break;
        case 2:
          await loadSyslogData();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error loading tool data:', error);
      toast.error('Failed to load tool data');
    }
  };
  useEffect(() => {
    loadToolData();
  }, [tabValue]);
  const loadSuricataData = async () => {
    setSuricataAlerts([
      {
        id: 1,
        timestamp: '2024-01-15 10:30:15',
        severity: 'high',
        category: 'web-application-attack',
        signature: 'ET WEB_APPLICATION SQL Injection Attack',
        src_ip: '192.168.100.50',
        dst_ip: '192.168.100.10',
        src_port: 45123,
        dst_port: 80,
        protocol: 'TCP',
        details: 'SQL injection attempt detected in HTTP POST request'
      },
      {
        id: 2,
        timestamp: '2024-01-15 10:31:02',
        severity: 'medium',
        category: 'attempted-reconnaissance',
        signature: 'ET SCAN SSH Brute Force Attack',
        src_ip: '192.168.100.60',
        dst_ip: '192.168.100.10',
        src_port: 35678,
        dst_port: 22,
        protocol: 'TCP',
        details: 'Multiple SSH login attempts detected'
      },
      {
        id: 3,
        timestamp: '2024-01-15 10:32:45',
        severity: 'low',
        category: 'policy-violation',
        signature: 'ET POLICY HTTP Suspicious User-Agent',
        src_ip: '192.168.100.70',
        dst_ip: '192.168.100.15',
        src_port: 52341,
        dst_port: 80,
        protocol: 'TCP',
        details: 'Automated tool detected via User-Agent string'
      }
    ]);
  };
  const loadWiresharkData = async () => {
    setPacketData([
      {
        id: 1,
        time: '10:30:15.123456',
        src: '192.168.100.50',
        dst: '192.168.100.10',
        protocol: 'HTTP',
        length: 512,
        info: 'POST /login.php HTTP/1.1',
        flags: ['PSH', 'ACK'],
        payload: "POST /login.php HTTP/1.1\\r\\nHost: vulnerable.app\\r\\nContent-Length: 85\\r\\n\\r\\nusername=admin' OR 1=1--&password=test"
      },
      {
        id: 2,
        time: '10:30:16.234567',
        src: '192.168.100.10',
        dst: '192.168.100.50',
        protocol: 'HTTP',
        length: 256,
        info: 'HTTP/1.1 200 OK',
        flags: ['PSH', 'ACK'],
        payload: 'HTTP/1.1 200 OK\\r\\nContent-Type: text/html\\r\\nContent-Length: 1024\\r\\n\\r\\n<html><body>Welcome admin!</body></html>'
      },
      {
        id: 3,
        time: '10:31:02.345678',
        src: '192.168.100.60',
        dst: '192.168.100.10',
        protocol: 'SSH',
        length: 64,
        info: 'SSH Login Attempt',
        flags: ['SYN'],
        payload: 'SSH-2.0-OpenSSH_7.4'
      }
    ]);
  };
  const loadSyslogData = async () => {
    setSyslogData([
      {
        id: 1,
        timestamp: '2024-01-15 10:30:15',
        level: 'error',
        source: 'apache',
        facility: 'local0',
        message: '[client 192.168.100.50:45123] ModSecurity: Access denied with code 403, SQL injection attack detected in POST body',
        host: 'webserver-01'
      },
      {
        id: 2,
        timestamp: '2024-01-15 10:31:02',
        level: 'warning',
        source: 'sshd',
        facility: 'auth',
        message: 'Failed password for root from 192.168.100.60 port 35678 ssh2',
        host: 'server-01'
      },
      {
        id: 3,
        timestamp: '2024-01-15 10:32:45',
        level: 'info',
        source: 'nginx',
        facility: 'local1',
        message: '192.168.100.70 - - [15/Jan/2024:10:32:45 +0000] "GET /admin/ HTTP/1.1" 403 162 "-" "sqlmap/1.6.12"',
        host: 'webserver-02'
      }
    ]);
  };
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };
  const getLogLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'debug': return 'default';
      default: return 'default';
    }
  };
  const startPacketCapture = async () => {
    setCaptureRunning(true);
    toast.success('Packet capture started');
    setTimeout(() => {
      setPacketData(prev => [...prev, {
        id: prev.length + 1,
        time: new Date().toLocaleTimeString() + '.123456',
        src: '192.168.100.80',
        dst: '192.168.100.10',
        protocol: 'TCP',
        length: 74,
        info: 'SYN Packet',
        flags: ['SYN']
      }]);
    }, 2000);
  };
  const stopPacketCapture = () => {
    setCaptureRunning(false);
    toast.success('Packet capture stopped');
  };
  const exportData = (toolName) => {
    toast.success(`${toolName} data exported successfully`);
  };
  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Security Tools Integration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Access integrated security tools for incident analysis and response
        </Typography>
      </Paper>
      <Card>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<Security />} label="Suricata IDS" />
          <Tab icon={<NetworkCheck />} label="Wireshark" />
          <Tab icon={<Storage />} label="Syslog Viewer" />
        </Tabs>
        {}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Suricata IDS Alerts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time intrusion detection alerts and signatures
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Severity</InputLabel>
                    <Select
                      value={filters.suricata.severity}
                      label="Severity"
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        suricata: { ...prev.suricata, severity: e.target.value }
                      }))}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </Select>
                  </FormControl>
                  <Button variant="outlined" startIcon={<Refresh />} onClick={loadSuricataData}>
                    Refresh
                  </Button>
                  <Button variant="outlined" startIcon={<Download />} onClick={() => exportData('Suricata')}>
                    Export
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Signature</TableCell>
                    <TableCell>Source → Destination</TableCell>
                    <TableCell>Protocol</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suricataAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>{alert.timestamp}</TableCell>
                      <TableCell>
                        <Chip 
                          label={alert.severity.toUpperCase()}
                          color={getSeverityColor(alert.severity)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {alert.signature}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {alert.category}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {alert.src_ip}:{alert.src_port} → {alert.dst_ip}:{alert.dst_port}
                        </Typography>
                      </TableCell>
                      <TableCell>{alert.protocol}</TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small">
                          <Launch />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
        {}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Network Packet Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Deep packet inspection and network traffic analysis
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button 
                    variant={captureRunning ? "outlined" : "contained"}
                    color={captureRunning ? "error" : "success"}
                    startIcon={captureRunning ? <Stop /> : <PlayArrow />}
                    onClick={captureRunning ? stopPacketCapture : startPacketCapture}
                  >
                    {captureRunning ? 'Stop' : 'Start'} Capture
                  </Button>
                  <Button variant="outlined" startIcon={<Download />} onClick={() => exportData('Wireshark')}>
                    Export PCAP
                  </Button>
                </Box>
              </Grid>
            </Grid>
            {}
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <FilterList sx={{ mr: 1 }} />
                <Typography>Packet Filters</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Source IP"
                      size="small"
                      value={filters.wireshark.src}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        wireshark: { ...prev.wireshark, src: e.target.value }
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Destination IP"
                      size="small"
                      value={filters.wireshark.dst}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        wireshark: { ...prev.wireshark, dst: e.target.value }
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Protocol</InputLabel>
                      <Select
                        value={filters.wireshark.protocol}
                        label="Protocol"
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          wireshark: { ...prev.wireshark, protocol: e.target.value }
                        }))}
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="HTTP">HTTP</MenuItem>
                        <MenuItem value="TCP">TCP</MenuItem>
                        <MenuItem value="UDP">UDP</MenuItem>
                        <MenuItem value="SSH">SSH</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Destination</TableCell>
                    <TableCell>Protocol</TableCell>
                    <TableCell>Length</TableCell>
                    <TableCell>Info</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {packetData.map((packet) => (
                    <TableRow 
                      key={packet.id} 
                      hover
                      onClick={() => setSelectedPacket(packet)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{packet.time}</TableCell>
                      <TableCell>{packet.src}</TableCell>
                      <TableCell>{packet.dst}</TableCell>
                      <TableCell>
                        <Chip label={packet.protocol} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{packet.length}</TableCell>
                      <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {packet.info}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => setSelectedPacket(packet)}>
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
        {}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  System Log Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Centralized log collection and analysis from multiple sources
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <TextField
                    size="small"
                    placeholder="Search logs..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    value={filters.syslog.search}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      syslog: { ...prev.syslog, search: e.target.value }
                    }))}
                  />
                  <Button variant="outlined" startIcon={<Download />} onClick={() => exportData('Syslog')}>
                    Export
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Log Level</InputLabel>
                  <Select
                    value={filters.syslog.level}
                    label="Log Level"
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      syslog: { ...prev.syslog, level: e.target.value }
                    }))}
                  >
                    <MenuItem value="all">All Levels</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                    <MenuItem value="warning">Warning</MenuItem>
                    <MenuItem value="info">Info</MenuItem>
                    <MenuItem value="debug">Debug</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Source</InputLabel>
                  <Select
                    value={filters.syslog.source}
                    label="Source"
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      syslog: { ...prev.syslog, source: e.target.value }
                    }))}
                  >
                    <MenuItem value="all">All Sources</MenuItem>
                    <MenuItem value="apache">Apache</MenuItem>
                    <MenuItem value="nginx">Nginx</MenuItem>
                    <MenuItem value="sshd">SSH Daemon</MenuItem>
                    <MenuItem value="kernel">Kernel</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Auto Refresh"
                />
              </Grid>
            </Grid>
            <List sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              {syslogData.map((log) => (
                <React.Fragment key={log.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Chip 
                        label={log.level.toUpperCase()}
                        color={getLogLevelColor(log.level)}
                        size="small"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" component="span">
                            {log.timestamp} - {log.host} - {log.source}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {log.facility}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
                          {log.message}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {log.id < syslogData.length && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </TabPanel>
      </Card>
      {}
      <Dialog 
        open={!!selectedPacket} 
        onClose={() => setSelectedPacket(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Packet Details - {selectedPacket?.protocol} {selectedPacket?.src} → {selectedPacket?.dst}
        </DialogTitle>
        <DialogContent>
          {selectedPacket && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Time:</Typography>
                  <Typography variant="body2">{selectedPacket.time}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Length:</Typography>
                  <Typography variant="body2">{selectedPacket.length} bytes</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Source:</Typography>
                  <Typography variant="body2">{selectedPacket.src}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Destination:</Typography>
                  <Typography variant="body2">{selectedPacket.dst}</Typography>
                </Grid>
              </Grid>
              {selectedPacket.flags && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>TCP Flags:</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {selectedPacket.flags.map((flag) => (
                      <Chip key={flag} label={flag} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
              <Typography variant="subtitle2" gutterBottom>Payload:</Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  {selectedPacket.payload || 'No payload data available'}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPacket(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Tools;