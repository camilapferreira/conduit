import "./App.css";
import { Home } from "./pages/Home";
import { Components } from "./pages/Components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthLayout, ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ArticleEditCreate } from "./pages/ArticleEditCreate";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { AuthProvider } from "./components/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/components" element={<Components />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected: only when token is true */}
            <Route element={<ProtectedRoute />}>
              <Route path="/editor" element={<ArticleEditCreate />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
