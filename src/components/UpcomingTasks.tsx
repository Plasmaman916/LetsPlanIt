import { useState, useEffect } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

/*
 * TaskCard will have props
 * Name, Due Date, and Priority
 */
type TaskCardProps = {
  name: string;
  dueDate: string;
  priority: number;
  dueTime: string;
};

function TaskCard({ name, dueDate, priority, dueTime }: TaskCardProps) {
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
          Due: {dueDate} @ {dueTime}
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
  type Task = {
    fields: {
      due_date: string;
      name: string;
      priority: number;
    };
  };
  const [fetchedTasks, setFetchedTasks] = useState<Task[]>();

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(
          "http://localhost:5173/api/get_all_tasks",
          {
            credentials: "include" as const,
          }
        );

        if (!response.ok) {
          console.error(
            "An error occurred while fetching the tasks from UpcomingTasks.tsx"
          );
        } else {
          const data = await response.json();
          console.log(data.slice(0, 2));
          setFetchedTasks(data.slice(0, 2));
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchTasks();
  }, []);

  return (
    <div className="h-112 w-100 bg-white rounded-lg shadow-xl/30">
      <div className="h-14 w-100 bg-[#4A4458] text-[#d0bcfe] font-bungee text-4xl flex justify-center items-center rounded-md">
        <span>Upcoming Tasks</span>
      </div>
      {/*Sample Tasks*/} {/*Only two TaskCards should be displayed*/}
      <div className="flex flex-col justify-center items-center gap-2 pt-2">
        {fetchedTasks?.map((task, index) => {
          const isoString = task.fields.due_date;
          const dateObj = new Date(isoString);

          // Format MM/DD
          const formattedDate = `${(dateObj.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${dateObj
            .getDate()
            .toString()
            .padStart(2, "0")}`;

          // Format hh:mm AM/PM
          let hours = dateObj.getUTCHours();
          const minutes = dateObj.getUTCMinutes().toString().padStart(2, "0");
          const ampm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12 || 12;
          const formattedTime = `${hours}:${minutes} ${ampm}`;

          console.log("Date:", formattedDate); // → 04/25
          console.log("Time:", formattedTime); // → 11:59 PM
          console.log(new Date(isoString).getHours());
          return (
            <TaskCard
              key={index}
              name={task.fields.name}
              dueDate={formattedDate}
              priority={task.fields.priority}
              dueTime={formattedTime}
            />
          );
        })}
      </div>
    </div>
  );
}

export default UpcomingTasks;
