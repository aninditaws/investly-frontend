import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InvestmentCalculator = () => {
  const [goal, setGoal] = useState(""); // Desired goal amount
  const [deadline, setDeadline] = useState(""); // Deadline (YYYY-MM-DD)
  const [result, setResult] = useState(null); // Calculation result
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // Get JWT token from localStorage

  // Configure Axios headers with the JWT token
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const calculateInvestment = async () => {
    setLoading(true);
    try {
      // Fetch data from the backend
      const response = await axios.get(
        "http://localhost:5000/api/market-data",
        axiosConfig
      );

      const marketData = response.data; // Market data fetched from the backend

      // Example logic: Calculate average return across sectors
      const averageReturn =
        marketData.reduce((sum, item) => sum + item.average_return, 0) /
        marketData.length;

      // Calculate the number of years until the deadline
      const currentDate = new Date();
      const targetDate = new Date(deadline);
      const yearsUntilDeadline =
        (targetDate - currentDate) / (1000 * 60 * 60 * 24 * 365);

      // Calculate required yearly investment
      const requiredInvestment =
        goal / Math.pow(1 + averageReturn / 100, yearsUntilDeadline);

      // Set result
      setResult({
        averageReturn,
        yearsUntilDeadline: yearsUntilDeadline.toFixed(2),
        requiredInvestment: requiredInvestment.toFixed(2),
      });
    } catch (error) {
      console.error("Error fetching market data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="investment-calculator bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute bottom-4 left-4 bg-gray-600 text-white px-4 py-2 rounded-md"
      >
        Back to Dashboard
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Investment Calculator
      </h2>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculateInvestment();
        }}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="goal"
              className="block text-gray-700 font-medium mb-1"
            >
              How much money do you want to achieve?
            </label>
            <input
              type="number"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(parseFloat(e.target.value))}
              placeholder="Enter your goal amount"
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
          </div>

          <div>
            <label
              htmlFor="deadline"
              className="block text-gray-700 font-medium mb-1"
            >
              When is your deadline? (YYYY-MM-DD)
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Calculate
        </button>
      </form>

      {/* Display Results */}
      {loading && <p className="mt-4 text-gray-500">Calculating...</p>}

      {result && (
        <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md">
          <h3 className="font-bold text-lg">Investment Plan</h3>
          <p>
            <strong>Average Return Rate:</strong>{" "}
            {result.averageReturn.toFixed(2)}%
          </p>
          <p>
            <strong>Years Until Deadline:</strong> {result.yearsUntilDeadline}{" "}
            years
          </p>
          <p>
            <strong>Required Yearly Investment:</strong> $
            {result.requiredInvestment}/year
          </p>
          <p className="mt-2 text-sm text-gray-600">
            * Based on market average returns and your selected deadline.
          </p>
        </div>
      )}
    </div>
  );
};

export default InvestmentCalculator;
