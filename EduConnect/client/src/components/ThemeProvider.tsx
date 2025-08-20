import { createContext, useContext, useEffect, useState } from "react";

type Theme = "default" | "dark" | "vibrant" | "soft";

type ThemeProviderContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined);

export { ThemeProviderContext };

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("default");

  useEffect(() => {
    const savedTheme = localStorage.getItem("preferred-theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Remove all theme classes
    document.body.classList.remove("theme-default", "theme-dark", "theme-vibrant", "theme-soft");
    
    // Add current theme class
    document.body.classList.add(`theme-${theme}`);
    
    // Store theme preference
    localStorage.setItem("preferred-theme", theme);
    
    // Add transition class temporarily
    document.body.style.transition = "all 0.3s ease";
    setTimeout(() => {
      document.body.style.transition = "";
    }, 300);
  }, [theme]);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
