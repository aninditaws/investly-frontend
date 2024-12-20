import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const InvestmentRecommendation = ({ userId }) => {
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch investment recommendation data
    const getRecommendation = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/recommendation/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecommendation(response.data);
      } catch (error) {
        setError("Error fetching recommendation");
        console.error("Error fetching recommendation:", error);
      }
    };

    getRecommendation();
  }, [userId]);

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!recommendation) {
    return (
      <div className="text-center py-4">
        <div className="text-xl text-gray-500">Loading recommendation...</div>
      </div>
    );
  }

  // Prepare data for the pie chart
  const chartData = {
    labels: recommendation.changes.map((change) => change.asset_type),
    datasets: [
      {
        label: "Recommended Allocation (%)",
        data: recommendation.changes.map(
          (change) => change.recommended_allocation
        ),
        backgroundColor: [
          "#FF6384", // Red
          "#36A2EB", // Blue
          "#FFCE56", // Yellow
          "#4BC0C0", // Teal
          "#FF9F40", // Orange
        ],
        hoverBackgroundColor: [
          "#FF6384CC", // Red (hover effect)
          "#36A2EBCC", // Blue (hover effect)
          "#FFCE56CC", // Yellow (hover effect)
          "#4BC0C0CC", // Teal (hover effect)
          "#FF9F40CC", // Orange (hover effect)
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mt-6 p-6 bg-gray-50 shadow-lg rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Investment Recommendation
      </h2>
      <p className="text-gray-600 mb-4">{recommendation.message}</p>

      {/* Pie Chart Container */}
      <div className="mb-8 flex justify-center items-center">
        <div className="w-64 h-64 p-4 flex items-center justify-center">
          <div className="w-full h-full">
            <Pie
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Detailed Recommendations */}
      <ul className="space-y-4">
        {recommendation.changes.map((change, index) => (
          <li
            key={index}
            className="flex items-center p-4 bg-gray-50 border-l-4 border-indigo-500 rounded-md shadow-md transition-transform transform hover:scale-105"
          >
            <div className="flex-1">
              <h3 className="text-lg font-medium text-black">
                {change.asset_type}
              </h3>
              <p className="text-sm text-black">
                Recommended Allocation: {change.recommended_allocation}%
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvestmentRecommendation;
