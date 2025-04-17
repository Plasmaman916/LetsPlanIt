import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

type DayProps = {
  day: number;
};
function Day({ day }: DayProps) {
  return (
    <span className="py-3 rounded-full hover:bg-gray-700 transition-all duration-300 font-bold">
      {day}
    </span>
  );
}

function Calendar() {
  const date = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(date.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(date.getFullYear());

  type TimeData = {
    blanks: number[];
    days: number[];
  };
  function getMonthData(year: number, monthIndex: number): TimeData {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);

    const totalDays = lastDay.getDate();
    const startWeekDay = firstDay.getDay();

    //const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const blanks: number[] = Array(startWeekDay).fill(0);
    const days: number[] = Array.from({ length: totalDays }, (_, i) => i + 1);

    return { blanks, days };
  }

  const { blanks, days } = getMonthData(currentYear, currentMonth);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="">
      <div className="h-14 w-100 bg-white font-bungee text-[#47034b] text-4xl flex justify-center items-center rounded-lg shadow-xl/50">
        <span>Calendar</span>
      </div>
      <div className="h-118 w-100 bg-[#47034b] text-white rounded-lg px-3 pb-3 shadow-xl/50">
        {/*Month & Year row*/}
        <div className="w-full flex justify-around items-center py-10 font-medium text-2xl">
          {/*Left Arrow*/}
          <div className="group w-8 h-8 rounded-full flex justify-center items-center transition-all duration-300">
            <div
              className="group-hover:bg-white rounded-full p-1 transition-all duration-300"
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-300 group-hover:text-black transition-colors duration-300" />
            </div>
          </div>

          {/*Month & Year*/}
          <div className="w-[200px] text-center">
            <span>
              {months[currentMonth]} {currentYear}
            </span>
          </div>

          {/*Right Arrow*/}
          <div className="group w-8 h-8 rounded-full flex justify-center items-center transition-all duration-300">
            <div
              className="group-hover:bg-white rounded-full p-1 transition-all duration-300"
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
            >
              <ChevronRightIcon className="h-6 w-6 text-gray-300 group-hover:text-black transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/*Weekday row*/}
        <div className="grid grid-cols-7 gap-2 font-semibold text-gray-400 text-center">
          <span>SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
        </div>

        {/*Days of the month*/}
        <div className="grid grid-cols-7 gap-2 text-center">
          {blanks.map((_, index) => {
            return <div key={index}></div>;
          })}
          {days.map((day, index) => {
            return <Day key={index} day={day} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
