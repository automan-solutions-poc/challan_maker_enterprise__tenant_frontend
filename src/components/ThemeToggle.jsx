import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeContext";

export default function ThemeToggle({ className = "", withLabel = false }) {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "light" ? "dark" : "light";
  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
      {withLabel && <span className="theme-toggle-label">{theme === "light" ? "Dark mode" : "Light mode"}</span>}
    </button>
  );
}
