import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const MarketData = () => {
  const { sector } = useParams(); // Get sector from URL
  const [marketData, setMarketData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/market-data/sector/${sector}`
      );
      setMarketData(response.data);
    };
    fetchData();
  }, [sector]);

  return (
    <div className="market-data bg-white shadow-md rounded-lg p-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute bottom-4 left-4 bg-gray-600 text-white px-4 py-2 rounded-md"
      >
        Back to Dashboard
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Market Data for {sector} Sector
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                Ticker
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                Price
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                Volume
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                Volatility
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                Average Return
              </th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="border border-gray-300 px-4 py-2 text-gray-800">
                  {item.ticker_symbol}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-800">
                  ${item.price.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-800">
                  {item.volume.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-800">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-800">
                  {item.volatility}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-800">
                  {(item.average_return * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketData;
