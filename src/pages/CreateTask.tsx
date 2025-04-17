import { useState } from "react";
import Navigation from "../components/Navigation";
import Calendar from "../components/Calendar";
import UpcomingTasks from "../components/UpcomingTasks";
import { TrashIcon, CheckIcon } from "@heroicons/react/24/solid";

function CreateInputs() {
  return (
    <div className="h-120 w-110 bg-white rounded-lg shadow-xl/30">
      <div className="font-bungee text-[#47034b] text-5xl py-3 pl-3">
        <span>Create Task</span>
      </div>

      <form className="flex flex-col gap-2">
        {/*Title Input*/}
        <div className="flex flex-col items-start w-[300px] space-y-1 pl-7">
          <label className="font-bungee text-[#47034b] text-2xl">Title</label>{" "}
          <input
            type="text"
            placeholder="e.g. SE 3354"
            className="w-95 h-9 bg-[#ddc7c7] rounded-md px-2 border border-gray-300 focus: border-3 focus:border-[#8a048c] outline-none transition-all duration-100 font-sans"
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
            />
          </div>

          {/*4/15 Align Time input correctly*/}
          {/*Time Input*/}
          <div className="flex flex-col items-start w-[300px] space-y-1 pl-4">
            <label className="font-bungee text-[#47034b] text-2xl">Time</label>
            <input
              type="time"
              className="w-42 h-9 bg-[#ddc7c7] rounded-md px-2 border border-gray-300 focus: border-3 focus:border-[#8a048c] outline-none transition-all duration-100 font-sans"
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
          >
            <option value="1">1 (highest)</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5 (lowest)</option>
          </select>
        </div>

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
            onSubmit={() => {}}
            className="group flex items-center justify-around w-24 h-12 bg-[#eaddff] rounded-xl border border-gray-300 focus: border-3 hover:border-[#8a048c] outline-none transition-all duration-100 cursor-pointer"
          >
            <CheckIcon className="h-7 h-3 text-[#47034b] group-hover:text-blue-300" />
            <span className="font-semibold text-1xl group-hover:text-blue-300">
              Save
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

function CreateTask() {
  return (
    <>
      <div className="bg-[#d3d3d3] relative min-h-screen ">
        <Navigation />
        <br />
        <br />
        <br />
        <br />
        <div className="flex justify-center items-center ">
          <CreateInputs />
        </div>
      </div>
    </>
  );
}

export default CreateTask;
