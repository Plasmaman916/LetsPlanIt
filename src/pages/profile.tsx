"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle, Share2, Clock, AlertCircle } from "lucide-react"

import Navigation from "../components/Navigation"

// Task type definition
interface Task {
  id: string
  title: string
  description: string
  status: "completed" | "pending" | "overdue"
  dueDate: string
  isShared: boolean
  sharedWith?: string[]
}

export default function Profile() {
  const navigate = useNavigate()
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [sharedTasks, setSharedTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [activeTab, setActiveTab] = useState<string>("profile")

  useEffect(() => {
    async function checkLoggedIn() {
      try {
        const response = await fetch("http://localhost:5173/api/session", {
          credentials: "include" as const,
        })

        if (!response.ok) {
          console.error("An error occurred while trying to check if the user was logged in")
        } else {
          const text: string = await response.text()
          console.log(text, "this is the text after typing /dashboard")
          if (text === "the session does not have the user id") {
            // user is not logged in
            setUsername("")
            navigate("/", { replace: true })
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    async function getUserData() {
      setIsLoading(true)
      try {
        // Get user profile data
        const profileResponse = await fetch("http://localhost:5173/api/session_username", {
          credentials: "include" as const,
        })

        if (profileResponse.ok) {
          const data = await profileResponse.json()
          setUsername(data.username)
          setEmail(data.email || "")
        }

        // Get user tasks
        const tasksResponse = await fetch("http://localhost:5173/api/tasks", {
          credentials: "include" as const,
        })

        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json()
          // Filter personal and shared tasks
          const personalTasks = tasksData.filter((task: Task) => !task.isShared)
          const shared = tasksData.filter((task: Task) => task.isShared)

          setTasks(personalTasks)
          setSharedTasks(shared)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkLoggedIn()
    getUserData()
  }, [navigate])

  const handleSaveChanges = async () => {
    // Validate password match if changing password
    if (password && password !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" })
      return
    }

    setIsSaving(true)
    setMessage(null)

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
      })

      if (response.ok) {
        setMessage({ text: "Profile updated successfully", type: "success" })
        // Clear password fields after successful update
        setPassword("")
        setConfirmPassword("")
      } else {
        const errorData = await response.json()
        setMessage({ text: errorData.message || "Failed to update profile", type: "error" })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage({ text: "An error occurred while updating your profile", type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-[#d3d3d3] font-sans">
      <Navigation username={username} />

      <div className="max-w-4xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold text-center text-[#4A4458] mb-8">Your Profile</h1>

        {/* Custom Tabs */}
        <div className="w-full mb-6">
          <div className="grid w-full grid-cols-3 bg-white rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-3 px-4 font-medium text-center transition-colors ${
                activeTab === "profile" ? "bg-[#4A4458] text-white" : "bg-white text-[#4A4458] hover:bg-gray-100"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`py-3 px-4 font-medium text-center transition-colors ${
                activeTab === "tasks" ? "bg-[#4A4458] text-white" : "bg-white text-[#4A4458] hover:bg-gray-100"
              }`}
            >
              My Tasks
            </button>
            <button
              onClick={() => setActiveTab("shared")}
              className={`py-3 px-4 font-medium text-center transition-colors ${
                activeTab === "shared" ? "bg-[#4A4458] text-white" : "bg-white text-[#4A4458] hover:bg-gray-100"
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
                    message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="username" className="block text-lg font-bold text-[#4A4458]">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    placeholder="e.g. TestUser123"
                    className="w-full px-4 py-2 border rounded-md bg-gray-100"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="email" className="block text-lg font-bold text-[#4A4458]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="e.g. test@email.com"
                    className="w-full px-4 py-2 border rounded-md bg-gray-100"
                  />
                </div>

                <div className="h-[1px] w-full bg-gray-200 my-4"></div>
                <h3 className="text-lg font-bold text-[#4A4458]">Change Password</h3>

                <div className="grid gap-2">
                  <label htmlFor="password" className="block text-lg font-bold text-[#4A4458]">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border rounded-md bg-gray-100"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="confirmPassword" className="block text-lg font-bold text-[#4A4458]">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
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
              <h2 className="text-xl font-bold text-[#4A4458] mb-2">My Tasks</h2>
              <p className="text-gray-600 mb-6">View and manage all your personal tasks</p>

              {isLoading ? (
                <div className="text-center py-8">Loading your tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  You don't have any tasks yet. Create your first task to get started!
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-start p-4 border rounded-lg bg-white">
                      <div className="mr-3 mt-1">{getStatusIcon(task.status)}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-[#4A4458]">{task.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shared Tasks Tab Content */}
        {activeTab === "shared" && (
          <div className="bg-white rounded-2xl shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#4A4458] mb-2">Shared Tasks</h2>
              <p className="text-gray-600 mb-6">Tasks that are shared with other users</p>

              {isLoading ? (
                <div className="text-center py-8">Loading shared tasks...</div>
              ) : sharedTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  You don't have any shared tasks. Share a task to collaborate with others!
                </div>
              ) : (
                <div className="space-y-4">
                  {sharedTasks.map((task) => (
                    <div key={task.id} className="flex items-start p-4 border rounded-lg bg-white">
                      <div className="mr-3 mt-1">{getStatusIcon(task.status)}</div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium text-[#4A4458]">{task.title}</h3>
                          <Share2 className="h-4 w-4 ml-2 text-[#4A4458]" />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span className="mr-3">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          {task.sharedWith && <span>Shared with: {task.sharedWith.join(", ")}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
