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
    async function checkLoggedIn() {
      try {
        const response = await fetch("http://localhost:5173/api/session", {
          credentials: "include" as const,
        });

        if (!response.ok) {
          console.error(
            "An error occurred while trying to check if the user was logged in"
          );
        } else {
          const text: string = await response.text();
          console.log(text, "this is the text after typing /dashboard");
          if (text === "the session does not have the user id") {
            // user is not logged in
            setUsername("");
            navigate("/", { replace: true });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    async function retrieveUsername() {
      try {
        const response = await fetch("http://localhost:5173/api/session_username", {
          credentials: "include" as const,
        });

        if (!response.ok) {
          console.error(
            "An error occurred while trying to retrieve the username"
          );
        } else {
          const data = await response.json();
          setUsername(data.username);
        }
      } catch (error) {
        console.error(error);
      }
    }

    checkLoggedIn(); // checking if the user is logged in first and if not then redirect to the login page
    retrieveUsername(); // get the username only after checking if the user is logged in
  }, []);

  //console.log(username);
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
