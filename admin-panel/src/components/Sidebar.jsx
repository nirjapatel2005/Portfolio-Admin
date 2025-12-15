import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Home", path: "/dashboard/home", icon: "🏠" },
  { name: "About", path: "/dashboard/about", icon: "👤" },
  { name: "Users", path: "/dashboard/users", icon: "👥" },
  { name: "Experience", path: "/dashboard/experience", icon: "💼" },
  { name: "Skills", path: "/dashboard/skills", icon: "🛠️" },
  { name: "Projects", path: "/dashboard/projects", icon: "📁" },
  { name: "Blog", path: "/dashboard/blog", icon: "📝" },
  { name: "Testimonial", path: "/dashboard/testimonial", icon: "💬" },
  { name: "Services", path: "/dashboard/services", icon: "⚙️" },
  { name: "Media", path: "/dashboard/media", icon: "🖼️" },
];

export default function Sidebar({ isOpen }) {
  return (
    <aside className={`${isOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 fixed left-0 top-0 h-full z-40`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
        {isOpen ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-bold text-white">Portfolio CMS</h1>
          </div>
        ) : (
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">P</span>
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
            <span className="text-lg">{item.icon}</span>
            {isOpen && (
              <span className="ml-3 font-medium">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
