import React, { useState } from 'react';
import { Box, Drawer, IconButton, Typography, List, ListItemButton, ListItemIcon, ListItemText, Button, Avatar, Stack, Chip } from '@mui/material';
import { Menu, DashboardOutlined, AssignmentOutlined, ManageSearch, EmojiEventsOutlined, PersonOutline, Logout, Radar } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
const width = 248;
const items = [
  ['Overview', '/dashboard', <DashboardOutlined />], ['Scenarios', '/scenarios', <AssignmentOutlined />],
  ['Evidence tools', '/tools', <ManageSearch />], ['Leaderboard', '/leaderboard', <EmojiEventsOutlined />],
  ['Profile', '/profile', <PersonOutline />],
];
export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const active = items.find(([, route]) => location.pathname.startsWith(route));
  const sidebar = <Stack sx={{ height: '100%', p: 2 }}>
    <Stack direction="row" gap={1.5} alignItems="center" sx={{ px: 1, py: 3 }}><Radar sx={{ color: 'primary.main', fontSize: 32 }} /><Box><Typography sx={{ fontWeight: 600, letterSpacing: '-.04em', fontSize: 22 }}>Response Lab</Typography><Typography variant="caption" color="text.secondary">INCIDENT TRAINING</Typography></Box></Stack>
    <Typography variant="overline" color="text.secondary" sx={{ px: 2, mt: 3 }}>Workspace</Typography>
    <List>{items.map(([title, route, icon]) => <ListItemButton key={route} selected={location.pathname.startsWith(route)} aria-current={location.pathname.startsWith(route) ? 'page' : undefined} onClick={() => { navigate(route); setOpen(false); }} sx={{ borderRadius: 2, my: .5, minHeight: 48, '&.Mui-selected': { bgcolor: '#252a45', color: '#c1c5ff' } }}><ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{icon}</ListItemIcon><ListItemText primary={title} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} /></ListItemButton>)}</List>
    <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid', borderColor: 'divider' }}><Typography variant="caption" color="text.secondary">Synthetic evidence. Real practice.<br />For learning, not live monitoring.</Typography></Box>
    <Stack direction="row" alignItems="center" gap={1.5} sx={{ px: 1, pt: 2 }}><Avatar sx={{ bgcolor: '#303751', color: '#e5e7ff', width: 34, height: 34 }}>{(user?.firstName || user?.username || 'A')[0]}</Avatar><Box sx={{ minWidth: 0 }}><Typography variant="body2" noWrap>{user?.firstName || user?.username}</Typography><Typography variant="caption" color="text.secondary">{user?.role || 'Learner'}</Typography></Box></Stack>
    <Button startIcon={<Logout />} onClick={logout} sx={{ justifyContent: 'flex-start', mt: 1 }}>Sign out</Button>
  </Stack>;
  return <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <Box component="a" href="#workspace-content" sx={{ position: 'fixed', left: 16, top: -100, zIndex: 1500, bgcolor: 'background.paper', p: 2, color: 'primary.main', '&:focus': { top: 8 } }}>Skip to content</Box>
    <Box component="nav" aria-label="Workspace navigation" sx={{ width: { md: width }, flexShrink: { md: 0 } }}>
      <Drawer variant="temporary" open={open} onClose={() => setOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width, background: '#0e1118' } }}>{sidebar}</Drawer>
      <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width, background: '#0e1118', boxSizing: 'border-box' } }} open>{sidebar}</Drawer>
    </Box>
    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
      <Stack component="header" direction="row" alignItems="center" gap={2} sx={{ minHeight: 72, px: { xs: 2, md: 4 }, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#0e1118' }}>
        <IconButton aria-label="Open navigation" onClick={() => setOpen(true)} sx={{ display: { md: 'none' } }}><Menu /></IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>Workspace <Box component="span" sx={{ mx: 1, color: 'text.secondary' }}>/</Box><Box component="span" sx={{ color: 'text.primary' }}>{active?.[0] || 'Investigation'}</Box></Typography>
        <Chip label="Training environment" size="small" variant="outlined" sx={{ display: { xs: 'none', sm: 'flex' } }} />
      </Stack>
      <Box component="main" id="workspace-content" tabIndex={-1} sx={{ p: { xs: 2, sm: 3, lg: 5 }, maxWidth: 1500, mx: 'auto' }}>{children}</Box>
    </Box>
  </Box>;
}
