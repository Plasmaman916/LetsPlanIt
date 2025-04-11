import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex justify-center items-center w-5/9 bg-[#4A4458]">
          <h1 className="text-white font-bold font-BungeeInline text-4xl">
            Lets Plan It
          </h1>
        </div>

        {/* Right Half */}
        <div>
          <div>Login</div>

          <form>
            <input
              type="text"
              placeholder="Username"
              required
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <br />
            <button type="submit">LOGIN</button>
          </form>

          <span>
            <a href="">Forgot Password?</a>
          </span>
          <br />
          <span>
            <a href="">Register Now!!</a>
          </span>
        </div>
      </div>
    </>
  );
}

export default Login;
