import { createTheme } from '@mui/material/styles';

// Near-black surfaces and restrained indigo, informed by the Linear reference.
export default createTheme({
  palette: {
    mode: 'dark', primary: { main: '#a3a8ff', contrastText: '#111321' },
    secondary: { main: '#a3a8ff' }, background: { default: '#090b10', paper: '#12151d' },
    text: { primary: '#f7f8f8', secondary: '#abb2c3' }, divider: '#292e3c',
    success: { main: '#72dcb1' }, warning: { main: '#f5cb7d' }, error: { main: '#ff959f' }, info: { main: '#93bbff' },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h1: { fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, letterSpacing: '-.055em' },
    h2: { fontSize: '2rem', fontWeight: 600, letterSpacing: '-.035em' },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 600, letterSpacing: '-.035em' },
    h5: { fontSize: '1.3rem', fontWeight: 600 }, h6: { fontSize: '1rem', fontWeight: 600 },
    body1: { lineHeight: 1.7 }, body2: { lineHeight: 1.65 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: { styleOverrides: {
      body: { fontFeatureSettings: '"cv01", "ss03"' },
      '*:focus-visible': { outline: '2px solid #a3a8ff', outlineOffset: 4 },
      '::selection': { background: '#414a80', color: '#fff' },
      '@media (prefers-reduced-motion: reduce)': { '*, *::before, *::after': { animation: 'none !important', transition: 'none !important', scrollBehavior: 'auto !important' } },
    } },
    MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { backgroundImage: 'none', border: '1px solid #292e3c' } } },
    MuiCard: { styleOverrides: { root: { boxShadow: 'none', borderRadius: 14 } } },
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { minHeight: 44, padding: '9px 18px' } } },
    MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44 } } },
    MuiOutlinedInput: { styleOverrides: { root: { background: '#0e1118', minHeight: 48 }, notchedOutline: { borderColor: '#424959' } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 6, fontWeight: 500 } } },
    MuiTableCell: { styleOverrides: { head: { color: '#abb2c3', background: '#0e1118' }, root: { borderColor: '#292e3c' } } },
    MuiTabs: { styleOverrides: { root: { borderBottom: '1px solid #292e3c' } } },
  },
});
