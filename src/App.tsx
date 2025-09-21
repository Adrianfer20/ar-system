import { AuthProvider } from "./context/AuthContext";
import { TicketsProvider } from "./context/TicketsContext";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";

function App() {
  // Vite expone BASE_URL con el valor de base en build (p.ej. /ar-system/)
  const basename = import.meta.env.BASE_URL || "/";
  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <TicketsProvider>
          <AppRoutes />
        </TicketsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
