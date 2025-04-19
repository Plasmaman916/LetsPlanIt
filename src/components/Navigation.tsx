import { useNavigate } from "react-router-dom";

function Navigation() {
  const navigate = useNavigate();
  const logout = async (e: any) => {
    e.preventDefault();
    const url = "http://localhost:8000/logout";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.error("An error occurred while trying to logout");
      } else {
        // successful request
        const text = await response.text();
        if (text === "Logged out") {
          // logout
          redirectToRoot();
        } else {
          // this should not executed
          console.log("this should not execute");
        }
      }
    } catch (error) {
      console.error("An error occurred while trying tp log out", error);
    }
  };

  const redirectToRoot = () => {
    navigate("/", { replace: true });
  };

  return (
    <header className="w-full h-18 bg-[#4A4458]">
      <nav className="flex justify-between items-center">
        <a href="/dashboard" className="pt-2">
          <span className="font-bungee text-white font-bold text-3xl pl-21 hover:text-[#2b3328] transition-all duration-100">
            Let's Plan It
          </span>
        </a>

        <ul className="flex-1 flex justify-end items-center gap-18 pr-21 pt-3">
          <li>
            <a
              href="/create"
              className="font-bungee text-white flex flex-col justify-center items-center hover:text-[#2b3328] transition-all duration-175"
            >
              <img src="/add.png" width="32" height="32" />
              <span className="hover:text-[#2b3328] transition-all duration-175">
                Create Task
              </span>
            </a>
          </li>
          <li>
            <a
              href="/profile"
              className="font-bungee text-white flex flex-col justify-center items-center hover:text-[#2b3328] transition-all duration-175"
            >
              <img src="/user (4).png" width="32" height="32" />
              <span className="hover:text-[#2b3328] transition-all duration-175">
                Profile
              </span>
            </a>
          </li>
          <li onClick={logout}>
            <a
              href="/"
              className="font-bungee text-white flex flex-col justify-center items-center hover:text-[#2b3328] transition-all duration-175"
            >
              <img src="/logout.png" width="32" height="32" />
              <span className="hover:text-[#2b3328] transition-all duration-175">
                Log Out
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;
