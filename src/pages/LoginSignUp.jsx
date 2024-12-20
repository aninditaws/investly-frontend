import "../index.css";
import { useState } from "react";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginSignUp = () => {
  const [action, setAction] = useState("Sign Up");
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (action === "Login") {
      // Login
      setError(null); // Reset error

      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/login",
          {
            name: emailOrUsername,
            email: emailOrUsername,
            password: password,
          }
        );

        // Simpan token JWT ke localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("name", response.data.name);
        console.log("Login successful:", response.data);

        // Redirect ke dashboard setelah login berhasil
        navigate("/dashboard");
      } catch (err) {
        console.error("Error logging in:", err);
        setError("Invalid credentials. Please try again.");
      }
    } else {
      // Sign up
      setError(null); // Reset error

      // Validasi password dan confirm password
      if (password !== confirmPassword) {
        return setError("Passwords do not match");
      }

      if (!validateEmail(email)) {
        return setError("Please enter a valid email address");
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/register",
          {
            username,
            email,
            password,
          }
        );
        console.log("User registered:", response.data);
        setError(null);
        setPassword("");
        setUsername("");
        setEmail("");
        setConfirmPassword("");
        setEmailOrUsername("");
        setAction("Login"); // Redirect to login page after successful sign-up
      } catch (err) {
        console.error("Error registering user:", err);
        setError("Failed to register. Please try again.");
      }
    }
  };

  const handleChangeState = (action) => {
    setAction(action);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setEmailOrUsername("");
    setError(null);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  return (
    <div className="flex flex-col mx-auto w-2/5 bg-white">
      {/* Login and sign up switch button */}
      <div className="flex gap-8 mx-auto mt-5">
        <div
          className={`flex justify-center items-center w-56 h-14 text-lg font-bold rounded-full cursor-pointer
            ${
              action === "Login"
                ? "bg-gray-200 text-gray-600"
                : "bg-[#4c00b4] text-white"
            }`}
          onClick={() => handleChangeState("Sign Up")}
        >
          Sign Up
        </div>
        <div
          className={`flex justify-center items-center w-56 h-14 text-lg font-bold rounded-full cursor-pointer
            ${
              action === "Sign Up"
                ? "bg-gray-200 text-gray-600"
                : "bg-[#4c00b4] text-white"
            }`}
          onClick={() => handleChangeState("Login")}
        >
          Login
        </div>
      </div>

      {/* Title (sign up or login) */}

      <div className="flex flex-col items-center gap-2 w-full mt-8">
        <div className="text-[#3c009d] text-5xl font-bold">{action}</div>
        {/* <div className="w-32 h-1.5 bg-[#3c009d] rounded-lg"></div> */}
        {/* Errors */}

        <div className="text-red-600 text-xl">{error}</div>
      </div>

      {/* Fields */}

      <div className="mt-3 flex flex-col gap-6">
        {action === "Login" ? (
          // If login, then show login elements
          <>
            <div className="flex items-center mx-auto w-[480px] h-20 bg-[#eaeaea] rounded-md">
              <img src={user_icon} alt="" className="mx-8" />
              <input
                type="text"
                placeholder="Enter Email or Username"
                className="h-12 w-[400px] bg-transparent border-none outline-none text-gray-600 text-lg"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center mx-auto w-[480px] h-20 bg-[#eaeaea] rounded-md">
              <img src={password_icon} alt="" className="mx-8" />
              <input
                type="password"
                placeholder="Enter Password"
                className="h-12 w-[400px] bg-transparent border-none outline-none text-gray-600 text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center mx-auto w-[480px] h-20 bg-[#eaeaea] rounded-md">
              <img src={user_icon} alt="" className="mx-8" />
              <input
                type="text"
                placeholder="Enter Username"
                className="h-12 w-[400px] bg-transparent border-none outline-none text-gray-600 text-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center mx-auto w-[480px] h-20 bg-[#eaeaea] rounded-md">
              <img src={email_icon} alt="" className="mx-8" />
              <input
                type="email"
                placeholder="Enter Email"
                className="h-12 w-[400px] bg-transparent border-none outline-none text-gray-600 text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center mx-auto w-[480px] h-20 bg-[#eaeaea] rounded-md">
              <img src={password_icon} alt="" className="mx-8" />
              <input
                type="password"
                placeholder="Enter Password"
                className="h-12 w-[400px] bg-transparent border-none outline-none text-gray-600 text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center mx-auto w-[480px] h-20 bg-[#eaeaea] rounded-md">
              <img src={password_icon} alt="" className="mx-8" />
              <input
                type="password"
                placeholder="Confirm Password"
                className="h-12 w-[400px] bg-transparent border-none outline-none text-gray-600 text-lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}
      </div>

      {/* Submit button */}
      <div className="flex justify-center mt-4">
        <button
          className="px-8 py-3 bg-[#4c00b4] text-white rounded-full font-bold"
          onClick={() => handleSubmit()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default LoginSignUp;
