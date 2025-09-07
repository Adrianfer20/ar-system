import { AuthProvider } from "./context/AuthContext";
import { TicketsProvider } from "./context/TicketsContext";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TicketsProvider>
          <AppRoutes />
        </TicketsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
