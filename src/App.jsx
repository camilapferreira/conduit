import "./App.css";
import { Home } from "./pages/Home";
import { Components } from "./pages/Components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthLayout, ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

// Add these when you have the pages:
// import { Login } from "./pages/Login";
// import { Register } from "./pages/Register";
// import { Settings } from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/components" element={<Components />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected: only when token is true */}
          <Route element={<ProtectedRoute />}>
            {/* <Route path="/settings" element={<Settings />} /> */}
            {/* <Route path="/editor" element={<ArticleEditCreate />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
