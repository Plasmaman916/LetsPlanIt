function Navigation() {
  // 4/12 fix spacing, size, and alignment of each link and its symbol
  return (
    <header className="w-full h-18 bg-[#4A4458]">
      <nav className="flex justify-between items-center">
        <a href="/dashboard" className="pt-2">
          <span className="font-bungee text-white font-bold text-3xl pl-21 hover:text-[#2b3328] transition-all duration-100">
            Let's Plan It
          </span>
        </a>

        <ul className="flex-1 flex justify-end items-center gap-18 pr-21 pt-3">
          <li>
            <a
              href="/create_task"
              className="font-bungee text-white flex flex-col justify-center items-center hover:text-[#2b3328] transition-all duration-175"
            >
              <img src="/add.png" width="32" height="32" />
              <span className="hover:text-[#2b3328] transition-all duration-175">
                Create Task
              </span>
            </a>
          </li>
          <li>
            <a
              href="/profile"
              className="font-bungee text-white flex flex-col justify-center items-center hover:text-[#2b3328] transition-all duration-175"
            >
              <img src="/user (4).png" width="32" height="32" />
              <span className="hover:text-[#2b3328] transition-all duration-175">
                Profile
              </span>
            </a>
          </li>
          <li>
            <a
              href="/"
              className="font-bungee text-white flex flex-col justify-center items-center hover:text-[#2b3328] transition-all duration-175"
            >
              <img src="/logout.png" width="32" height="32" />
              <span className="hover:text-[#2b3328] transition-all duration-175">
                Log Out
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;
