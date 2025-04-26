import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Calendar from "../components/Calendar";
import UpcomingTasks from "../components/UpcomingTasks";
import {
  TrashIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

function InviteeTabs({ username }) {
  return (
    <div className="h-7 rounded-2xl bg-gray-100">
      <span className="px-3 text-gray-500">{username}</span>
    </div>
  );
}

function CreateInputs() {
  // useState
  const [invitees, setInvitees] = useState<string[]>([]); // an array of strings
  const [invitee, setInvitee] = useState<string>("");
  const [unableToFindUser, setUnableToFindUser] = useState<boolean>(false);
  const [userAddedAlready, setUserAddedAlready] = useState<boolean>(false);
  const [needToProvideDetails, setNeedToProvideDetails] =
    useState<boolean>(false);
  const [cannotAddYourself, setCannotAddYourself] = useState<boolean>(false);

  const [ableToCreateTask, setAbleToCreateTask] = useState<boolean>(false);
  const [unableToCreateTask, setUnableToCreateTask] = useState<boolean>(false);

  // other fields for the task
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [dueTime, setDueTime] = useState<string>("");
  const [priority, setPriority] = useState<string>("1");
  const [reminders, setReminders] = useState<boolean>(false);

  async function searchUser() {
    const data = {
      username: invitee,
    };
    const url = "http://localhost:5173/api/search_user";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include" as const,
    };

    if (invitees.includes(invitee)) {
      setUserAddedAlready(true);
    } else {
      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          console.error("An issue occurred while searching for a user");
          // display 'unable to find username' text
          setUserAddedAlready(false);
          setNeedToProvideDetails(false);
          setCannotAddYourself(false);
          setUnableToFindUser(true);
        } else {
          const text: string = await response.text();

          if (text === "Could not find user") {
            console.error("An issue occurred while searching for a user");
            // display 'unable to find username' text
            setUserAddedAlready(false);
            setNeedToProvideDetails(false);
            setCannotAddYourself(false);
            setUnableToFindUser(true);
          } else if (text === "Cannot share to yourself") {
            setUserAddedAlready(false);
            setNeedToProvideDetails(false);
            setUnableToFindUser(false);
            setCannotAddYourself(true);
          } else {
            // found the username
            // add this user to invitees
            console.log(text);
            setInvitees((prevInvitees) => [...prevInvitees, invitee]);

            setUnableToFindUser(false);
            setUserAddedAlready(false);
            setNeedToProvideDetails(false);
            setCannotAddYourself(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  // if any of the fields are empty then don't proceed (except invitees and reminders)
  function validateFields() {
    // fields to check title, description, dueDate, dueTime, and priority
    if (
      title === "" ||
      description === "" ||
      dueDate === "" ||
      dueTime === "" ||
      priority === ""
    ) {
      return false;
    }

    // else the above 4 are filled
    return true;
  }
  async function createTaskFromInputs(e) {
    e.preventDefault();

    console.log(validateFields());
    if (!validateFields()) {
      console.log("Need to provide a title, description, dueDate, and dueTime");
      setUnableToFindUser(false);
      setUserAddedAlready(false);
      setNeedToProvideDetails(false);
      setCannotAddYourself(false);
      setNeedToProvideDetails(true);
    } else {
      // need to combine dueDate and dueTime
      setNeedToProvideDetails(false);
      const taskDue = dueDate + " " + dueTime;
      const taskData = {
        name: title,
        description,
        due_date: taskDue,
        priority: Number(priority),
        reminders,
        invitees,
      };
      console.log(taskData);

      try {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
          credentials: "include" as const,
        };
        const response = await fetch(
          "http://localhost:8000/create_task",
          options
        );

        if (!response.ok) {
          console.error("An error occurred while trying to create the task");
        } else {
          const text: string = await response.text();

          if (text === "Task created") {
            setAbleToCreateTask(true);
            setUnableToCreateTask(false);
            console.log("Created Task!");
          } else {
            setAbleToCreateTask(false);
            setUnableToCreateTask(true);
            console.log("Did not create task", text);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  return (
    <div className="w-110 bg-white rounded-lg shadow-xl/30">
      <div className="font-bungee text-[#47034b] text-5xl py-3 pl-3">
        <span>Create Task</span>
      </div>

      <form
        className="flex flex-col gap-2 pb-2"
        onSubmit={createTaskFromInputs}
      >
        {/*Title Input*/}
        <div className="flex flex-col items-start w-[300px] space-y-1 pl-7">
          <label className="font-bungee text-[#47034b] text-2xl">Title</label>{" "}
          <input
            type="text"
            placeholder="e.g. SE 3354"
            className="w-95 h-9 bg-[#ddc7c7] rounded-md px-2 border border-gray-300 focus: border-3 focus:border-[#8a048c] outline-none transition-all duration-100 font-sans"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>

        {/*Description Input*/}
        <div className="flex flex-col items-start w-[300px] space-y-1 pl-7">
          <label className="font-bungee text-[#47034b] text-2xl">
            Description
          </label>{" "}
          <input
            type="text"
            placeholder="e.g. HW#1"
            className="w-95 h-9 bg-[#ddc7c7] rounded-md px-2 border border-gray-300 focus: border-3 focus:border-[#8a048c] outline-none transition-all duration-100 font-sans"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>

        {/*Date & Time inputs*/}
        <div className="flex justify-evenly items-center ">
          {/*Date Input*/}
          <div className="flex flex-col items-start w-[300px] space-y-1 pl-7">
            <label className="font-bungee text-[#47034b] text-2xl">Date</label>
            <input
              type="date"
              placeholder="MM/DD/YY"
              className="w-42 h-9 bg-[#ddc7c7] rounded-md px-2 border border-gray-300 focus: border-3 focus:border-[#8a048c] outline-none transition-all duration-100 font-sans"
              onChange={(e) => {
                console.log(e.target.value);
                setDueDate(e.target.value);
              }}
            />
          </div>

          {/*Time Input*/}
          <div className="flex flex-col items-start w-[300px] space-y-1 pl-4">
            <label className="font-bungee text-[#47034b] text-2xl">Time</label>
            <input
              type="time"
              className="w-42 h-9 bg-[#ddc7c7] rounded-md px-2 border border-gray-300 focus: border-3 focus:border-[#8a048c] outline-none transition-all duration-100 font-sans"
              onChange={(e) => {
                console.log(e.target.value);
                setDueTime(e.target.value);
              }}
            />
          </div>
        </div>

        {/*Priority Input*/}
        <div className="flex flex-col justfy-center items-start w-[405px] pl-7">
          <label className="font-bungee text-[#47034b] text-2xl">
            Priority
          </label>
          <select
            name="priority"
            id="priority"
            className="w-full h-9 bg-[#ddc7c7] rounded-md border border-gray-300 focus: border-3 focus:border-[#8a048c] outline-none transition-all duration-100 font-sans"
            onChange={(e) => {
              console.log(e.target.value);
              setPriority(e.target.value);
            }}
          >
            <option value="1">1 (highest)</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5 (lowest)</option>
          </select>
        </div>

        {/*Reminders*/}
        <div className="flex items-start w-[300px] space-x-4 pl-7">
          <label className="font-bungee text-[#47034b] text-2xl">
            Reminders?
          </label>

          <label className="inline-flex items-center cursor-pointer pt-1">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              onChange={(e) => {
                console.log(e.target.checked);
                setReminders(e.target.checked);
              }}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:[#8a048c] dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#8a048c] dark:peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Search for Invitees*/}
        <div className="flex flex-col items-start w-[300px] space-y-1 pl-7">
          <label className="font-bungee text-[#47034b] text-2xl">
            Invite People
          </label>

          <div className="relative w-fit">
            <input
              type="text"
              placeholder="Search Username"
              className="bg-gray-100 h-9 w-72 pl-3 pr-10 rounded-lg border border-gray-300 focus:border-[#8a048c] outline-none transition-all duration-100 font-sans"
              onChange={(e) => setInvitee(e.target.value)}
            />
            <MagnifyingGlassIcon
              className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 cursor-pointer"
              onClick={searchUser}
            />
          </div>
        </div>

        {/*Display the list of invitees that are invited*/}
        <div className="flex flex-col items-start w-[300px] space-y-1 pl-7">
          <div className="flex flex-wrap gap-2 items-center justify-start">
            {invitees.map((invitee, index) => {
              return <InviteeTabs key={index} username={invitee} />;
            })}
          </div>
        </div>

        <span className="pl-7 text-red-400">
          {cannotAddYourself
            ? "Cannot share to yourself!"
            : userAddedAlready
            ? "User added already!"
            : unableToFindUser
            ? "Couldn't find user!"
            : needToProvideDetails
            ? "Need to provide a title, description, time, date, and priority!"
            : ""}
        </span>

        {/*Clear and Submit Buttons*/}
        <div className="w-full flex items-center justify-between px-7 pt-3">
          {/*Clear Button*/}
          <button
            onClick={() => {}}
            className="group flex items-center justify-around w-24 h-12 bg-[#eaddff] rounded-xl border border-gray-300 focus: border-3 hover:border-[#8a048c] outline-none transition-all duration-100 cursor-pointer"
          >
            <TrashIcon className="h-7 h-3 text-[#47034b] group-hover:text-white" />
            <span className="font-semibold text-1xl group-hover:text-white">
              Clear
            </span>
          </button>

          {/*Submit Button*/}
          <button
            type="submit"
            className="group flex items-center justify-around w-24 h-12 bg-[#eaddff] rounded-xl border border-gray-300 focus: border-3 hover:border-[#8a048c] outline-none transition-all duration-100 cursor-pointer"
          >
            <CheckIcon className="h-7 h-3 text-[#47034b] group-hover:text-blue-300" />
            <span className="font-semibold text-1xl group-hover:text-blue-300">
              Save
            </span>
          </button>
        </div>
      </form>
      <span className="pl-8 font-bungee text-green-400 text-3xl">
        {ableToCreateTask ? "Created Task!" : ""}
      </span>
      <br />
      <span className="pl-8 font-bungee text-red-400 text-3xl">
        {unableToCreateTask ? "Unable to Create Task" : ""}
      </span>
    </div>
  );
}

function CreateTask() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>();

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

    async function getUsername() {
      try {
        const response = await fetch(
          "http://localhost:5173/api/session_username",
          {
            credentials: "include" as const,
          }
        );

        if (!response.ok) {
          console.error("An error occurred");
        } else {
          const data = await response.json();
          setUsername(data.username);
        }
      } catch (error) {
        console.error(error);
      }
    }

    checkLoggedIn();
    getUsername();
  }, []);

  return (
    <>
      <div className="bg-[#d3d3d3] relative min-h-screen ">
        <Navigation username={username} />
        <br />
        <br />
        <div className="flex justify-center items-center ">
          <CreateInputs />
        </div>
        <br />
      </div>
    </>
  );
}

export default CreateTask;
