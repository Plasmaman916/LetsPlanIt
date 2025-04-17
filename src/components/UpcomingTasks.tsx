import { useState, useEffect } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

/*
 * TaskCard will have props
 * Name, Due Date, and Priority
 */
type TaskCardProps = {
  name: string;
  dueMonth: number;
  dueDay: number;
  priority: number;
};

function TaskCard({ name, dueMonth, dueDay, priority }: TaskCardProps) {
  const priorityColors = [
    "text-red-600",
    "text-orange-500",
    "text-yellow-300",
    "text-green-500",
    "text-blue-500",
  ];

  return (
    <div className="w-full h-40 bg-[#d0bcff] rounded-md flex flex-col justify-center items-center gap-2 relative">
      {/*Edit Button*/}
      <div className="absolute top-2 right-2">
        <PencilSquareIcon className="w-11 h-11 text-[#4a4458] cursor-pointer hover:text-white" />
      </div>

      {/*Task name*/}
      <div>
        <span className="font-bungee text-2xl text-[#47034b]">{name}</span>
      </div>

      {/*Due Date*/}
      <div>
        <span className="font-bungee text-2xl text-[#47034b]">
          Due: {dueMonth}/{dueDay} @ 11:59PM
        </span>
      </div>

      {/* Priority */}
      <div>
        <span
          className={`font-bungee text-1xl ${priorityColors[priority - 1]}`}
        >
          Priority: {priority}
        </span>
      </div>
    </div>
  );
}

function UpcomingTasks() {
  return (
    <div className="h-112 w-100 bg-white rounded-lg shadow-xl/30">
      <div className="h-14 w-100 bg-[#4A4458] text-[#d0bcfe] font-bungee text-4xl flex justify-center items-center rounded-md">
        <span>Upcoming Tasks</span>
      </div>

      {/*Sample Tasks*/}
      <div className="flex flex-col justify-center items-center gap-2 pt-2">
        <TaskCard
          name={"SE 3354 Homework"}
          dueMonth={4}
          dueDay={15}
          priority={1}
        />

        <TaskCard
          name={"CS 4341 Homework"}
          dueMonth={4}
          dueDay={30}
          priority={3}
        />
      </div>
    </div>
  );
}

export default UpcomingTasks;
