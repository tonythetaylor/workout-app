import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { getSettings, updateSettings } from "../services/settingService"; // Import API functions
import { refreshAccessToken } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light"); // Default to 'light'
  const { user, isLoading, logout } = useAuth();
  const token = localStorage.getItem('token');

  const fetchUserTheme = async () => {
    if (!token) {
      // console.error('No token found. Redirecting to login.');
      return null; // Prevent rendering  
    }

    try {
      const { theme: userTheme } = await getSettings();
      setTheme(userTheme);
    } catch (error: any) {
      console.error('Failed to fetch user settings:', error);
      if (error.response?.status === 403) {
        logout(); // Handle invalid token
      }
    }
  };


  // Fetch the user's saved theme preference from the backend
  useEffect(() => {
    fetchUserTheme();
  }, [token]);

  // Apply the theme to the document root for global styling
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme); // Optionally save to localStorage
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Update the theme preference in the backend
    try {
      await updateSettings({ theme: newTheme });
    } catch (error) {
      console.error("Failed to update theme in settings:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
