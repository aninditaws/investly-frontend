import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [formData, setFormData] = useState({
    assetType: "",
    sector: "",
    allocationPercentage: "",
    targetAllocationPercentage: "",
    value: "",
    riskLevel: "",
  });
  const navigate = useNavigate();

  const userId = localStorage.getItem("id"); // Get userId from localStorage
  const token = localStorage.getItem("token"); // Get JWT token from localStorage

  // Configure Axios headers with the JWT token
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch user's portfolio
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/portfolio/${userId}`,
          axiosConfig
        );
        setPortfolio(response.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };

    fetchPortfolio();
  }, []);

  // Handle form submission to add portfolio
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/portfolio/",
        {
          userId, // Include userId in the request body
          ...formData,
        },
        axiosConfig
      );
      setPortfolio((prev) => [...prev, response.data[0]]); // Add new entry to portfolio
      setFormData({
        assetType: "",
        sector: "",
        allocationPercentage: "",
        targetAllocationPercentage: "",
        value: "",
        riskLevel: "",
      });
    } catch (error) {
      console.error("Error adding portfolio entry:", error);
    }
  };

  return (
    <div className="portfolio bg-white shadow-md rounded-lg p-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute bottom-4 left-4 bg-gray-600 text-white px-4 py-2 rounded-md"
      >
        Back to Dashboard
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Portfolio Management
      </h2>

      {/* Portfolio Table */}
      <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
              Asset Type
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
              Sector
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
              Allocation %
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
              Target Allocation %
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
              Value
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
              Risk Level
            </th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="border border-gray-300 px-4 py-2">
                {item.asset_type}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.sector}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.allocation_percentage}%
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.target_allocation_percentage}%
              </td>
              <td className="border border-gray-300 px-4 py-2">
                ${item.value.toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.risk_level}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Portfolio Form */}
      <form className="mt-6" onSubmit={handleSubmit}>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Add Asset</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Asset Type"
            value={formData.assetType}
            onChange={(e) =>
              setFormData({ ...formData, assetType: e.target.value })
            }
            className="border border-gray-300 rounded-md p-2"
          />
          <input
            type="text"
            placeholder="Sector"
            value={formData.sector}
            onChange={(e) =>
              setFormData({ ...formData, sector: e.target.value })
            }
            className="border border-gray-300 rounded-md p-2"
          />
          <input
            type="number"
            placeholder="Allocation %"
            value={formData.allocationPercentage}
            onChange={(e) =>
              setFormData({
                ...formData,
                allocationPercentage: parseFloat(e.target.value),
              })
            }
            className="border border-gray-300 rounded-md p-2"
          />
          <input
            type="number"
            placeholder="Target Allocation %"
            value={formData.targetAllocationPercentage}
            onChange={(e) =>
              setFormData({
                ...formData,
                targetAllocationPercentage: parseFloat(e.target.value),
              })
            }
            className="border border-gray-300 rounded-md p-2"
          />
          <input
            type="number"
            placeholder="Value"
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: parseFloat(e.target.value) })
            }
            className="border border-gray-300 rounded-md p-2"
          />
          <select
            value={formData.riskLevel}
            onChange={(e) =>
              setFormData({ ...formData, riskLevel: e.target.value })
            }
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Risk Level</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Add to Portfolio
        </button>
      </form>
    </div>
  );
};

export default Portfolio;
