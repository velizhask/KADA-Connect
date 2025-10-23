import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./auth/pages/AuthPage";
import "./app.css";
import CompanyPage from "./pages/company/CompanyPage";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/company" element={<CompanyPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
