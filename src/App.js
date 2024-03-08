import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container } from '@mui/material';

import Header from './Layout/Header'
import SignUp from './SignUp'

import './App.css';

const theme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: { color: "red" },
      },
    }
  },
  typography: {
    fontFamily: `"Lato", sans-serif`,
    fontSize: 15,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    button: {
      textTransform: 'none'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} disableGutters>
        <Header />
        <SignUp />
      </Container>
    </ThemeProvider>
  );
}

export default App;
