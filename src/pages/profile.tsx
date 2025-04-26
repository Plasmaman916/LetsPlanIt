"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Share2, Clock, AlertCircle } from "lucide-react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

import Navigation from "../components/Navigation";

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

// Task type definition
interface Task1 {
  id: string;
  title: string;
  description: string;
  status: "completed" | "pending" | "overdue";
  dueDate: string;
  isShared: boolean;
  sharedWith?: string[];
}

export default function Profile() {
  type Task = {
    fields: {
      due_date: string;
      name: string;
      priority: number;
    };
  };

  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  //const [tasks, setTasks] = useState<Task1[]>([]);
  //const [sharedTasks, setSharedTasks] = useState<Task1[]>([]);
  const [fetchedTasks, setFetchedTasks] = useState<Task[]>();
  const [sharedTasks, setSharedTasks] = useState<Task[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("profile");

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

    async function getUserData() {
      setIsLoading(true);
      try {
        // Get user profile data
        const profileResponse = await fetch(
          "http://localhost:5173/api/session_username",
          {
            credentials: "include" as const,
          }
        );

        if (profileResponse.ok) {
          const data = await profileResponse.json();
          setUsername(data.username);
          setEmail(data.email || "");
        }

        // Get user tasks
        const taskResponse = await fetch(
          "http://localhost:5173/api/get_all_tasks",
          {
            credentials: "include" as const,
          }
        );

        if (taskResponse.ok) {
          const data = await taskResponse.json();
          console.log(data, "here is the task data");
          setFetchedTasks(data);
        }

        // get shared tasks
        const sharedResponse = await fetch(
          "http://localhost:5173/api/get_shared_tasks",
          {
            credentials: "include" as const,
          }
        );

        if (sharedResponse.ok) {
          const data = await sharedResponse.json();
          console.log(data);
          setSharedTasks(data.data);
        } else {
          console.log("something went wrong while fetching for shared tasks");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkLoggedIn();
    getUserData();
  }, [navigate]);

  const handleSaveChanges = async () => {
    // Validate password match if changing password
    if (password && password !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("http://localhost:5173/api/update_profile", {
        method: "POST",
        credentials: "include" as const,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password: password || undefined, // Only send password if it's being changed
        }),
      });

      if (response.ok) {
        setMessage({ text: "Profile updated successfully", type: "success" });
        // Clear password fields after successful update
        setPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        setMessage({
          text: errorData.message || "Failed to update profile",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        text: "An error occurred while updating your profile",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#d3d3d3] font-sans">
      <Navigation username={username} />

      <div className="max-w-4xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold text-center text-[#4A4458] mb-8">
          Your Profile
        </h1>

        {/* Custom Tabs */}
        <div className="w-full mb-6">
          <div className="grid w-full grid-cols-3 bg-white rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-3 px-4 font-medium text-center transition-colors ${
                activeTab === "profile"
                  ? "bg-[#4A4458] text-white"
                  : "bg-white text-[#4A4458] hover:bg-gray-100"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`py-3 px-4 font-medium text-center transition-colors ${
                activeTab === "tasks"
                  ? "bg-[#4A4458] text-white"
                  : "bg-white text-[#4A4458] hover:bg-gray-100"
              }`}
            >
              My Tasks
            </button>
            <button
              onClick={() => setActiveTab("shared")}
              className={`py-3 px-4 font-medium text-center transition-colors ${
                activeTab === "shared"
                  ? "bg-[#4A4458] text-white"
                  : "bg-white text-[#4A4458] hover:bg-gray-100"
              }`}
            >
              Shared Tasks
            </button>
          </div>
        </div>

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow-md">
            <div className="p-8 space-y-6">
              {message && (
                <div
                  className={`p-3 rounded-md mb-4 ${
                    message.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="username"
                    className="block text-lg font-bold text-[#4A4458]"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUsername(e.target.value)
                    }
                    placeholder="e.g. TestUser123"
                    className="w-full px-4 py-2 border rounded-md bg-gray-100"
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="block text-lg font-bold text-[#4A4458]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    placeholder="e.g. test@email.com"
                    className="w-full px-4 py-2 border rounded-md bg-gray-100"
                  />
                </div>

                <div className="h-[1px] w-full bg-gray-200 my-4"></div>
                <h3 className="text-lg font-bold text-[#4A4458]">
                  Change Password
                </h3>

                <div className="grid gap-2">
                  <label
                    htmlFor="password"
                    className="block text-lg font-bold text-[#4A4458]"
                  >
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border rounded-md bg-gray-100"
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-lg font-bold text-[#4A4458]"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border rounded-md bg-gray-100"
                  />
                </div>

                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className={`mt-4 bg-[#4A4458] hover:bg-[#3a3546] text-white px-6 py-2 rounded-lg font-bold transition-all ${
                    isSaving ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab Content */}
        {activeTab === "tasks" && (
          <div className="bg-white rounded-2xl shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#4A4458] mb-2">
                My Tasks
              </h2>
              <p className="text-gray-600 mb-6">
                View and manage all your personal tasks
              </p>

              {isLoading ? (
                <div className="text-center py-8">Loading your tasks...</div>
              ) : fetchedTasks?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  You don't have any tasks yet. Create your first task to get
                  started!
                </div>
              ) : (
                <div className="space-y-2">
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
                    const minutes = dateObj
                      .getUTCMinutes()
                      .toString()
                      .padStart(2, "0");
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
              )}
            </div>
          </div>
        )}

        {/* Shared Tasks Tab Content */}
        {activeTab === "shared" && (
          <div className="bg-white rounded-2xl shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#4A4458] mb-2">
                Shared Tasks
              </h2>
              <p className="text-gray-600 mb-6">
                Tasks that are shared with other users
              </p>

              {isLoading ? (
                <div className="text-center py-8">Loading shared tasks...</div>
              ) : sharedTasks?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  You don't have any shared tasks. Share a task to collaborate
                  with others!
                </div>
              ) : (
                <div className="space-y-4">
                  {sharedTasks?.map((task, index) => {
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
                    const minutes = dateObj
                      .getUTCMinutes()
                      .toString()
                      .padStart(2, "0");
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
