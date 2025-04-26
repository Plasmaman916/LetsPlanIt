import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const data = {
        username,
        password,
      };
      const url = "http://localhost:8000/login";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include" as const,
      };
      const response = await fetch(url, options);

      if (!response.ok) {
        console.error("There was an error sending the request");
      } else {
        //console.log(response.body); // receiving response
        const text: string = await response.text();

        if (text === "Invalid login") {
          console.log("Username or password is incorrect");
          setErrorMessage("Username or Password is incorrect");
        } else {
          // successful login
          console.log(text);
          redirectToDashboard();
        }
      }
    } catch (error) {
      console.error("There was an error sending the request", error);
    }
  };

  const redirectToDashboard = () => {
    //window.location.href = "/dashboard"; // useNavigate
    navigate("/dashboard", {
      state: {
        username: username,
      },
    });
  };

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
            <h1 className="font-bungee font-bold text-5xl">Login</h1>
          </div>

          <form className="flex flex-col items-center pt-6" onSubmit={onSubmit}>
            <div className="flex">
              <img
                src="/user.png"
                width="48px"
                className="mr-4 max-lg:hidden"
              />
              <input
                type="text"
                placeholder="Username"
                required
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                className="text-2xl w-75 h-13 rounded-md bg-white placeholder: pl-2 text-gray-500 border border-gray-300 focus: border-3 focus:border-[#8a048c] outline-none transition-all duration-300"
              />
            </div>

            {/*apply the ^ styles to the second text field*/}

            <br />
            <div className="flex">
              <img
                src="/lock.png"
                width="50px"
                className="mr-4 max-lg:hidden"
              />
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="text-2xl w-75 h-13 rounded-md bg-white placeholder: pl-2 text-gray-500 border border-gray-300 focus: border-3 focus:border-[#8a048c] outline-none transition-all duration-300"
              />
            </div>

            <br />
            {/*Style Login Button */}
            <button
              type="submit"
              className="w-37 h-13 rounded-lg bg-[#8a048c] border-2 hover:bg-[#e002e3] active:bg-[#ee8bdf] transition-all duration-200 cursor-pointer"
            >
              <span className="font-bold font-bungee text-2xl">LOGIN </span>
            </button>
          </form>

          <span className="font-calistoga text-[#47034B] pt-3">
            <a href="">Forgot Password?</a>
          </span>
          <br />
          <span className="font-calistoga text-red-500">{errorMessage}</span>
          <br />
          <span className="font-calistoga text-[#47034B] text-4xl">
            <a href="/register">Register Now!</a>
          </span>
        </div>
      </div>
    </>
  );
}

export default Login;
