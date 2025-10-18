import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById("root"));
//console.log("Store is:", store);

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212", // page background
      paper: "#181a1b",   // card / paper background
    },
    text: {
      primary: "#ffffff",
      secondary: "#bbbbbb",
    },
  },
  typography: {
    allVariants: {
      color: "#efecffc5",
    },
  },
});

root.render(
  <Provider store={store}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <App />
    </ThemeProvider>
  </Provider>
);