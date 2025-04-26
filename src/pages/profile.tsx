"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navigation from "../components/Navigation";

export default function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>();

  useEffect(() => {
    async function checkLoggedIn() {
      try {
        const response = await fetch("http://localhost:8000/session", {
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
      // gets the username associated with the session
      try {
        const response = await fetch("http://localhost:8000/session_username", {
          credentials: "include" as const,
        });

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
    <div className="min-h-screen bg-[#d3d3d3] font-sans">
      <Navigation username={username} />

      <div className="max-w-3xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold text-center text-[#4A4458] mb-8">
          Your Profile
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
          <div>
            <label className="block text-lg font-bold text-[#4A4458] mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="e.g. TestUser123"
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-[#4A4458] mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="e.g. test@email.com"
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-[#4A4458] mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
          </div>

          <button className="mt-4 bg-[#4A4458] hover:bg-[#2b3328] text-white px-6 py-2 rounded-lg font-bold transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
