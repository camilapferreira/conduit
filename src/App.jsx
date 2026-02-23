import "./App.css";
import { Home } from "./pages/Home";
import { Components } from "./pages/Components";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/components" element={<Components />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
