import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ClinicProvider } from "./context/ClinicContext";
import { AppRoutes } from "./router";

const App = () => {
  return (
    <AuthProvider>
      <ClinicProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ClinicProvider>
    </AuthProvider>
  );
};

export default App;
