import { LogOut, Menu, UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  onOpenMenu?: () => void;
}

const Navbar = ({ onOpenMenu }: NavbarProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMenu}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="truncate">
          <h2 className="truncate font-semibold text-slate-800">
            Inventory Management
          </h2>
          <p className="hidden sm:block text-xs text-slate-500">
            Manage your business efficiently
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <UserCircle className="text-blue-600 shrink-0" size={25} />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold">{user?.name || "User"}</p>
            <p className="text-xs capitalize text-slate-500">
              {user?.role?.replace("_", " ")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1.5 sm:gap-2 rounded-lg px-2.5 sm:px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut size={17} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
