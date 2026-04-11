import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const API_URL = "http://localhost:5000/api";

type User = {
  id: string;
  email: string;
  fullName: string;
  role: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setAuthInfo: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  setAuthInfo: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
        }
      } catch (e) {
        localStorage.removeItem("token");
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const setAuthInfo = (token: string, newUser: User) => {
    localStorage.setItem("token", token);
    setUser(newUser);
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, setAuthInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
