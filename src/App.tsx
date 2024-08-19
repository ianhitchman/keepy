import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "./components/layout/Header";
import Main from "./components/layout/Main";

// Create a client
const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Header />
        <Main />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
