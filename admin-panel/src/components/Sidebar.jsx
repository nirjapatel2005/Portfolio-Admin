import { NavLink } from "react-router-dom";
import {
  BriefcaseIcon,
  ChatIcon,
  DashboardIcon,
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  ImageIcon,
  PortfolioIcon,
  SettingsIcon,
  ToolsIcon,
  UserIcon,
  UsersIcon,
} from "./Icons";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", Icon: DashboardIcon },
  { name: "Home", path: "/dashboard/home", Icon: HomeIcon },
  { name: "About", path: "/dashboard/about", Icon: UserIcon },
  { name: "Users", path: "/dashboard/users", Icon: UsersIcon },
  { name: "Experience", path: "/dashboard/experience", Icon: BriefcaseIcon },
  { name: "Skills", path: "/dashboard/skills", Icon: ToolsIcon },
  { name: "Projects", path: "/dashboard/projects", Icon: FolderIcon },
  { name: "Blog", path: "/dashboard/blog", Icon: DocumentIcon },
  { name: "Testimonial", path: "/dashboard/testimonial", Icon: ChatIcon },
  { name: "Services", path: "/dashboard/services", Icon: SettingsIcon },
  { name: "Media", path: "/dashboard/media", Icon: ImageIcon },
];

export default function Sidebar({ isOpen }) {
  return (
    <aside className={`${isOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 fixed left-0 top-0 h-full z-30`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
        {isOpen ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <PortfolioIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-white">Portfolio CMS</h1>
          </div>
        ) : (
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <PortfolioIcon className="w-5 h-5 text-blue-600" />
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${isOpen ? 'px-4' : 'px-2 justify-center'} py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-100 text-gray-700 hover:text-blue-600"
              }`
            }
            end={item.path === '/dashboard'}
            title={!isOpen ? item.name : ''}
          >
            <item.Icon className="w-5 h-5 flex-shrink-0" />
            {isOpen && (
              <span className="ml-3 font-medium">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
