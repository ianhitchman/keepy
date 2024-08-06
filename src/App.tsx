import { createTheme, ThemeProvider } from "@mui/material/styles";

import Main from "./components/layout/Main";
import Header from "./components/layout/Header";

const theme = createTheme({
  palette: {
    primary: {
      main: "#bd6dc6",
    },
    secondary: {
      main: "#ddd5b2",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Main />
    </ThemeProvider>
  );
}

export default App;
