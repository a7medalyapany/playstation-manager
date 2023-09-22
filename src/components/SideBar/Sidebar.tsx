import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { HiHome } from "react-icons/hi";
import { TbUserEdit } from "react-icons/tb";

import Box from "./Box";
import Library from "./Library";
import SidebarItem from "./SidebarItem";

function Sidebar() {
  const location = useLocation();
  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: "Home",
        active: location.pathname !== "/admin",
        href: "/",
      },
      {
        icon: TbUserEdit,
        label: "Admin",
        active: location.pathname === "/admin",
        href: "/admin",
      },
    ],
    [location.pathname]
  );
  return (
    <div className="w-1/5 h-screen">
      <div
        className="
    md:flex flex-col
    hidden
    p-2 gap-y-2
    h-full w-full
    bg-black
    "
      >
        <Box>
          <div
            className="
            flex flex-col
            px-5 py-4
            gap-y-4
            "
          >
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library />
        </Box>
      </div>
    </div>
  );
}

export default Sidebar;
