import { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex justify-center items-center w-5/9 bg-[#4A4458]">
          <h1 className="font-bungee text-white font-bold font-BungeeInline text-8xl">
            Lets Plan It
          </h1>
        </div>

        {/* Right Half */}
        <div className="flex flex-col justify-center items-center w-4/9 bg-[#D9D9D9]">
          <div>
            <h1 className="font-bungee font-bold text-5xl">Register</h1>
          </div>

          <form className="flex flex-col items-center pt-6">
            <div className="flex">
              <img
                src="/user.png"
                width="48px"
                className="mr-4 max-lg:hidden"
              />
              <input
                type="text"
                placeholder="Enter Username"
                required
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                className="text-2xl w-75 h-13 rounded-md bg-white placeholder: pl-2 text-gray-500 border border-gray-300 focus: border-3 focus:border-[#8a048c] outline-none transition-all duration-300"
              />
            </div>

            <br />
            <div className="flex pl-17">
              <input
                type="password"
                placeholder="Enter Password"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="text-2xl w-75 h-13 rounded-md bg-white placeholder: pl-2 text-gray-500 border border-gray-300 focus: border-3 focus:border-[#8a048c] outline-none transition-all duration-300"
              />
            </div>

            <div className="pt-3 pl-17">
              <input
                type="password"
                placeholder="Confirm Password"
                required
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                className="text-2xl w-75 h-13 rounded-md bg-white placeholder: pl-2 text-gray-500 border border-gray-300 focus: border-3 focus:border-[#8a048c] outline-none transition-all duration-300"
              />
            </div>

            <br />
            {/*Style Login Button */}
            <button
              type="submit"
              className="w-37 h-13 rounded-lg bg-[#8a048c] border-2 hover:bg-[#e002e3] active:bg-[#ee8bdf] transition-all duration-200"
            >
              <span className="font-bold font-bungee text-2xl">REGISTER </span>
            </button>
          </form>

          <span className="font-calistoga text-[#47034B] pt-3">
            <a href="/">Already have an account? Login</a>
          </span>
          <br />
          <br />
        </div>
      </div>
    </>
  );
}

export default Register;
