// src/App.js

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import ChatPage from './ChatPage';

function App() {
  const [darkMode, setDarkMode] = React.useState(true);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#6200ee', // Púrpura moderno
          },
          secondary: {
            main: '#03dac6', // Teal moderno
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
          },
        },
        typography: {
          fontFamily: 'Poppins, Roboto, Arial, sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              rounded: {
                borderRadius: 16,
              },
            },
          },
        },
      }),
    [darkMode],
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </ThemeProvider>
  );
}

export default App;
