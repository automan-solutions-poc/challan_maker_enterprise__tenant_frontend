import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { trackEvent, Events } from "./analytics";

const ThemeContext = createContext();

const STORAGE_KEY = "theme";

const readStoredTheme = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
};

const systemTheme = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

// Flip the attribute with transitions paused so every surface swaps in the same frame.
const applyTheme = (theme) => {
  const root = document.documentElement;
  if (root.getAttribute("data-bs-theme") === theme) return;
  root.classList.add("theme-switching");
  root.setAttribute("data-bs-theme", theme);
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => root.classList.remove("theme-switching"));
  });
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    const initial = readStoredTheme() || systemTheme();
    document.documentElement.setAttribute("data-bs-theme", initial);
    return initial;
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Follow the OS setting until the user picks a theme explicitly.
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      if (!readStoredTheme()) setThemeState(e.matches ? "dark" : "light");
    };
    query.addEventListener?.("change", onChange);
    return () => query.removeEventListener?.("change", onChange);
  }, []);

  const setTheme = useCallback((next) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    trackEvent(Events.THEME_TOGGLED, { theme: next });
    setTheme(next);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
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
