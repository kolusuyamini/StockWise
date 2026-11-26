import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Truck,
  ShoppingCart,
  Receipt,
  ChartNoAxesCombined,
  Boxes,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const links = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Products", path: "/products", icon: Package },
  { name: "Suppliers", path: "/suppliers", icon: Truck },
  { name: "Purchases", path: "/purchases", icon: ShoppingCart },
  { name: "Sales", path: "/sales", icon: Receipt },
  { name: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
];

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/50 md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex min-h-screen w-64 flex-col bg-slate-900 text-white transition-transform duration-200 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-6">
          <div className="flex items-center gap-3">
            <Boxes size={28} className="text-blue-400" />
            <h1 className="text-2xl font-bold">StockWise</h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-700 px-6 py-4 text-xs text-slate-400">
          StockWise Inventory System
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
