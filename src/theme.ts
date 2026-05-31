import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "system-ui", "Avenir", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  palette: {
    background: {
      default: '#f5f7fa',
      paper: 'rgba(255, 255, 255, 0.7)',
    },
    primary: {
      main: '#667eea',
      dark: '#5a67d8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8e8e93', // Apple gray
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff3b30', // Apple red
    },
    warning: {
      main: '#f6ad55',
    },
    success: {
      main: '#34c759', // Apple green
    },
    text: {
      primary: '#1c1c1e', // Apple dark text
      secondary: '#8e8e93',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          background-attachment: fixed;
          min-height: 100vh;
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(135deg, #667eea 0%, #8a9af3 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #7a8aed 100%)',
            },
          },
          '&.MuiButton-containedError': {
            background: 'linear-gradient(135deg, #ff3b30 0%, #ff6b63 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #e0352b 0%, #fa5c55 100%)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          padding: 8,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        },
      },
    },
  },
});

export default theme;
