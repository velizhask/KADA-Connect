import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./auth/pages/AuthPage";
import "./app.css";
import CompanyPage from "./pages/company/CompanyPage";
import HomePage from "./pages/home/HomePage";
import TraineePage from "./pages/trainee/TraineePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/companies" element={<CompanyPage />} />
        <Route path="/trainees" element={<TraineePage />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
