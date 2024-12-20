import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const RiskAssessment = () => {
  const userId = localStorage.getItem("id");
  const userName = localStorage.getItem("name");
  const navigate = useNavigate();

  // Cek apakah token login sudah dimiliki atau belum
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Jika tidak ada token, kembali ke halaman login
      navigate("/login");
    }
  }, [navigate]);

  const [responses, setResponses] = useState({
    question1: 0,
    question2: 0,
    question3: 0,
    question4: 0,
    question5: 0,
  });

  const [riskLevel, setRiskLevel] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResponses((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  const calculateRisk = () => {
    // Calculate average score
    const totalScore = Object.values(responses).reduce((a, b) => a + b, 0);
    const averageRisk = Math.round(totalScore / Object.keys(responses).length);
    setRiskLevel(averageRisk);
  };

  const changeRiskLevel = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/risklevel",
        {
          id: userId,
          riskLevel: riskLevel,
        }
      );
      console.log("Risk level changed:", response.data);
    } catch (err) {
      console.error("Error changing risk level:", err);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 relative">
      {/* Back Button at the Top-Left */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 left-4 bg-gray-600 text-white px-4 py-2 rounded-md"
      >
        Back to Dashboard
      </button>
      <div className="max-w-6xl mx-auto bg-white rounded-lg p-6">
        <h1 className="font-bold text-2xl text-gray-800 mb-4">
          Take your risk assessment test,{" "}
          <span className="text-indigo-600">{userName}</span>
        </h1>
        <p className="text-gray-600 mb-6">
          Answer the questions below to assess your investment risk level on a
          scale of 1 (low risk) to 10 (high risk).
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculateRisk();
          }}
        >
          {/* Risk Assessment Questions */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">
              1. How comfortable are you with the possibility of losing money in
              the short term?
            </label>
            <input
              type="range"
              min="1"
              max="10"
              name="question1"
              value={responses.question1}
              onChange={handleChange}
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              1 = Not comfortable, 10 = Very comfortable
            </p>
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">
              2. What is your primary goal for investing?
            </label>
            <select
              name="question2"
              value={responses.question2}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="0">-- Select --</option>
              <option value="2">Preserve capital</option>
              <option value="5">Steady growth</option>
              <option value="10">High returns</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">
              3. How long can you keep your money invested before needing to
              access it?
            </label>
            <select
              name="question3"
              value={responses.question3}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="0">-- Select --</option>
              <option value="2">Less than 1 year</option>
              <option value="5">1-5 years</option>
              <option value="10">More than 5 years</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">
              4. How would you react if your investments lost 20% of their value
              in a short period?
            </label>
            <select
              name="question4"
              value={responses.question4}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="0">-- Select --</option>
              <option value="2">Sell everything</option>
              <option value="5">Wait it out</option>
              <option value="10">Buy more</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">
              5. What is your experience level with investing?
            </label>
            <select
              name="question5"
              value={responses.question5}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="0">-- Select --</option>
              <option value="2">Beginner</option>
              <option value="5">Intermediate</option>
              <option value="10">Expert</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </form>

        {/* Display Risk Level */}
        {riskLevel !== null && (
          <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
            <p className="font-medium">
              Your Risk Level:{" "}
              <span className="text-indigo-600 text-xl">{riskLevel}</span>
            </p>
            <p>
              {riskLevel <= 3 && "You have a low-risk tolerance."}
              {riskLevel > 3 &&
                riskLevel <= 7 &&
                "You have a moderate-risk tolerance."}
              {riskLevel > 7 && "You have a high-risk tolerance."}
            </p>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-md"
              onClick={changeRiskLevel}
            >
              Save risk level
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskAssessment;
