import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Calendar from "../components/Calendar";
import UpcomingTasks from "../components/UpcomingTasks";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!location.state) {
      // redirect to login if there is no username
      navigate("/", { replace: true });
    } else {
      setUsername(location.state.username);
    }

    async function test() {
      try {
        const response = await fetch("http://localhost:8000/session");

        if (!response.ok) {
          console.error("An error ocurred");
        } else {
          const text: string = await response.text();
          console.log(text);
        }
      } catch (error) {
        console.error(error);
      }
    }

    test();
  }, []);

  console.log(username);
  return (
    <>
      <div className="bg-[#d3d3d3] relative">
        <Navigation username={username} />
        <span className="font-bungee text-[#47034b] text-3xl relative top-7 left-10">
          Welcome Back, {username}!
        </span>
        <div className="flex justify-around items-center min-h-screen relative bottom-6">
          <UpcomingTasks />
          <Calendar />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
