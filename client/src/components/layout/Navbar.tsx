
import { LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="font-semibold text-slate-800">Inventory Management</h2>
        <p className="text-xs text-slate-500">Manage your business efficiently</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <UserCircle className="text-blue-600" size={25} />
          <div>
            <p className="text-sm font-semibold">{user?.name || "User"}</p>
            <p className="text-xs capitalize text-slate-500">
              {user?.role?.replace("_", " ")}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
