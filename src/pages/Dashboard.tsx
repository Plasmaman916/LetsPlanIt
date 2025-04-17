import { useState } from "react";
import Navigation from "../components/Navigation";
import Calendar from "../components/Calendar";
import UpcomingTasks from "../components/UpcomingTasks";

function Dashboard() {
  return (
    <>
      <div className="bg-[#d3d3d3] relative">
        <Navigation />
        <span className="font-bungee text-[#47034b] text-3xl relative top-7 left-10">
          Welcome Back, Test!
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
