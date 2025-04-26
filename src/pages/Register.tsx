import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("You must confirm your password correctly");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Registering...");

    try {
      const response = await fetch("http://localhost:5173/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();

      if (response.ok && text.startsWith("Created new user")) {
        await fetch("http://localhost:5173/api/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        toast.success("Successfully registered and logged in!", { id: toastId });

        setTimeout(() => {
          navigate("/dashboard", { state: { username } });
        }, 1500);
      } else if (text === "User already exists") {
        setErrorMessage(text);
        toast.error("User already exists", { id: toastId });
      } else {
        toast.error("Registration failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Unexpected error!", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left */}
      <div className="w-1/2 bg-[#4A4458] flex items-center justify-center">
        <h1 className="font-bungee text-white font-bold text-8xl">Lets Plan It</h1>
      </div>

      {/* Right */}
      <div className="w-1/2 bg-[#D9D9D9] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="font-bungee font-bold text-5xl">Register</h1>

          <form className="flex flex-col items-center gap-4" onSubmit={onSubmit}>
            {/* Username */}
            <div className="flex items-center gap-3">
              <img src="/user.png" alt="user" width="32" />
              <input
                type="text"
                placeholder="Enter Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-xl w-[300px] h-12 rounded-md bg-white px-3 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8a048c]"
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-3">
              <img src="/lock.png" alt="lock" width="32" />
              <input
                type="password"
                placeholder="Enter Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-xl w-[300px] h-12 rounded-md bg-white px-3 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8a048c]"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex items-center gap-3">
              <img src="/lock.png" alt="lock" width="32" />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-xl w-[300px] h-12 rounded-md bg-white px-3 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8a048c]"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-[200px] h-12 rounded-md bg-[#8a048c] text-white font-bold hover:bg-[#e002e3] active:bg-[#ee8bdf] transition-all duration-300"
            >
              {isLoading ? "Registering..." : "REGISTER"}
            </button>
          </form>

          {/* Error */}
          {errorMessage && (
            <p className="text-red-600 text-center font-semibold">{errorMessage}</p>
          )}

          {/* Link */}
          <p className="font-calistoga text-[#47034B] pt-2">
            <a href="/">Already have an account? Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
