import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

type DayProps = {
  day: number;
};
function Day({ day }: DayProps) {
  return <span>{day}</span>;
}

function Calendar() {
  return (
    <>
      <div className="h-14 w-100 bg-[#d9d9d9] font-bungee text-[#47034b] text-4xl flex justify-center items-center rounded-sm">
        <span>Calendar</span>
      </div>
      <div className="h-100 w-100 bg-[#47034b] text-white rounded-lg">
        {/*Month & Year row*/}
        <div className="w-full flex justify-around items-center py-10 font-medium text-2xl">
          {/*Left Arrow*/}
          <div className="group w-8 h-8 rounded-full flex justify-center items-center transition-all duration-300">
            <div className="group-hover:bg-white rounded-full p-1 transition-all duration-300">
              <ChevronLeftIcon className="h-6 w-6 text-gray-300 group-hover:text-black transition-colors duration-300" />
            </div>
          </div>

          {/*Month & Year*/}
          <div>
            <span>September 2021</span>
          </div>

          {/*Right Arrow*/}
          <div className="group w-8 h-8 rounded-full flex justify-center items-center transition-all duration-300">
            <div className="group-hover:bg-white rounded-full p-1 transition-all duration-300">
              <ChevronRightIcon className="h-6 w-6 text-gray-300 group-hover:text-black transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/*Weekday row*/}
        <div className="w-full flex justify-center items-center gap-5 font-semibold">
          <span>SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
        </div>

        {/*Days of the month*/}
        <div>
          {/*Array(31)
          .fill(0)
          .map((_, index) => {
            return <Day key={index} day={index + 1} />;
          })*/}
          {/*4/15 apply similar styles as the weekday row */}
          <Day day={10} />
        </div>
      </div>
    </>
  );
}

export default Calendar;
