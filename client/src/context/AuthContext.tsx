
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  loginUser,
  getCurrentUser,
  registerUser,
} from "../services/authService";
import type {
  User,
  LoginData,
  RegisterData,
} from "../types/auth.types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("stockwise_token");

    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((response) => setUser(response.user))
      .catch(() => {
        localStorage.removeItem("stockwise_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (data: LoginData) => {
    const response = await loginUser(data);
    localStorage.setItem("stockwise_token", response.token);
    setUser(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await registerUser(data);
    localStorage.setItem("stockwise_token", response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem("stockwise_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
