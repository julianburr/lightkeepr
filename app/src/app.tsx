import { AuthLayout } from "./layouts/auth";
import { AppLayout } from "./layouts/app";
import { useAuth } from "./hooks/@firebase";

export function App() {
  const authUser = useAuth();

  if (!authUser) {
    return <AuthLayout />;
  }

  return <AppLayout />;
}

export default App;
