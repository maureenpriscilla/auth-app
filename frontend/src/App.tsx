import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Profile } from "./pages/Profile";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <nav>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup" style={{ marginLeft: "1rem" }}>
                Sign Up
            </Link>
            <Link to="/profile" style={{ marginLeft: "1rem" }}>
                Profile
            </Link>
        </nav>


        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<SignIn />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};
