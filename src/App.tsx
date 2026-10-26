import { useAuth } from "./contexts/AuthContext";
import { CloneApp } from "./components/CloneApp";
import { LoginScreen } from "./components/LoginScreen";

export function App() {
  const { session, loading } = useAuth();

  return (
    <div className="app">
      {loading ? (
        <div className="center-screen" role="status">
          Laden…
        </div>
      ) : session ? (
        <CloneApp key={session.user.id} />
      ) : (
        <LoginScreen />
      )}
    </div>
  );
}
