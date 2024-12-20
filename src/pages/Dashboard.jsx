import { useNavigate } from "react-router-dom";
import InvestmentRecommendation from "../components/InvestmentRecommendation";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const userId = localStorage.getItem("id");
  const userName = localStorage.getItem("name");
  const navigate = useNavigate();
  const [riskLevel, setRiskLevel] = useState(null); // Menyimpan level risiko pengguna
  const [selectedSector, setSelectedSector] = useState(""); // Menyimpan sektor yang dipilih

  // Memeriksa validitas token JWT dan mengarahkan ke login jika tidak valid
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // Arahkan ke halaman login jika token tidak ditemukan
    } else {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT without external library
        const currentTime = Date.now() / 1000; // Waktu saat ini dalam detik

        if (payload.exp < currentTime) {
          localStorage.removeItem("token"); // Hapus token jika sudah expired
          navigate("/login");
        }
      } catch (error) {
        console.error("Token tidak valid:", error);
        localStorage.removeItem("token"); // Hapus token jika tidak valid
        navigate("/login");
      }
    }
  }, [navigate]);

  // Mengambil level risiko dari database
  useEffect(() => {
    const fetchRiskLevel = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}/`
        );
        setRiskLevel(response.data.risk_level); // Menyimpan level risiko dalam state
      } catch (error) {
        console.error("Gagal mengambil level risiko:", error);
      }
    };

    fetchRiskLevel();
  }, [userId]);

  // Navigasi ke halaman data pasar berdasarkan sektor yang dipilih
  const handleNavigateToMarketData = () => {
    if (selectedSector) {
      navigate(`/market-data/${selectedSector}`);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-gray-50 shadow-lg rounded-lg p-6">
        {/* Header Welcome */}
        <h1 className="font-bold text-3xl text-gray-800 mb-6">
          Welcome to Investly Dashboard,{" "}
          <span className="text-indigo-600">{userName}</span>!
        </h1>

        {/* Profil Risiko */}
        <div className="mb-8 p-6 bg-blue-100 border-l-4 border-blue-500 rounded-md">
          {riskLevel !== null ? (
            <>
              <p className="font-medium text-lg text-blue-800">
                Your Risk Profile:{" "}
                <span className="text-indigo-600 text-2xl">{riskLevel}</span>
              </p>
              <p className="text-blue-700">
                {riskLevel <= 3 && "You have a low-risk tolerance."}
                {riskLevel > 3 &&
                  riskLevel <= 7 &&
                  "You have a moderate-risk tolerance."}
                {riskLevel > 7 && "You have a high-risk tolerance."}
              </p>
            </>
          ) : (
            <p className="text-gray-600">Loading your risk profile...</p>
          )}
        </div>

        {/* Komponen Rekomendasi Investasi */}
        <InvestmentRecommendation userId={userId} />

        {/* Pilihan Sektor untuk Data Pasar */}
        <div className="mt-8">
          <label
            htmlFor="sector"
            className="block text-gray-700 font-medium mb-2"
          >
            Select a Sector to View Market Data:
          </label>
          <div className="flex items-center gap-4">
            <select
              id="sector"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2"
            >
              <option value="">-- Select a Sector --</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Energy">Energy</option>
              <option value="Consumer Discretionary">
                Consumer Discretionary
              </option>
              <option value="Consumer Staples">Consumer Staples</option>
              <option value="Financials">Financials</option>
            </select>
            <button
              onClick={handleNavigateToMarketData}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md"
              disabled={!selectedSector}
            >
              View Market Data
            </button>
          </div>
        </div>

        {/* Navigasi ke Halaman Lain */}
        <div className="mt-10 flex flex-col gap-4">
          <button
            onClick={() => navigate("/risk")}
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Take Your Risk Assessment
          </button>
          <button
            onClick={() => navigate(`/portfolio/${userId}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Manage Your Portfolio
          </button>
          <button
            onClick={() => navigate(`/invest`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Calculate your investment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
