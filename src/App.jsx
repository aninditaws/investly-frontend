import "./App.css";
import Dashboard from "./pages/Dashboard";
import LoginSignUp from "./pages/LoginSignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RiskAssessment from "./pages/RiskAssessment";
import MarketData from "./pages/MarketData";
import Portfolio from "./pages/Portfolio";
import InvestmentCalculator from "./pages/InvestmentCalculator";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<LoginSignUp />} />
          <Route path="/login" element={<LoginSignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/risk" element={<RiskAssessment />} />
          <Route path="/market-data/:sector" element={<MarketData />} />
          <Route path="/portfolio/:userId" element={<Portfolio />} />
          <Route path="/invest" element={<InvestmentCalculator />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
