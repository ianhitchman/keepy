import { useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, toast } from "mui-sonner";
import useStore from "./hooks/useStore";

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
  const { errorMessage } = useStore();
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Header />
        <Main />
        <Toaster position="top-center" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
