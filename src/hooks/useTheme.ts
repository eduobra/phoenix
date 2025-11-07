import { useEffect, useState } from "react";

type Theme = "Light" | "Dark" | "System default";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("Dark"); // ✅ Default dark

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const defaultTheme = savedTheme || "Dark"; // ✅ fallback to Dark
    setTheme(defaultTheme);
    applyTheme(defaultTheme);
  }, []);

  const applyTheme = (selected: Theme) => {
    const root = document.documentElement;

    if (selected === "Dark") {
      root.classList.add("dark");
    } else if (selected === "Light") {
      root.classList.remove("dark");
    } else {
      // System default
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const updateTheme = (selected: Theme) => {
    setTheme(selected);
    localStorage.setItem("theme", selected);
    applyTheme(selected);
  };

  return { theme, updateTheme };
}
// import { useEffect } from "react";

// export function useTheme() {
//   useEffect(() => {
//     document.documentElement.classList.add("dark"); // ✅ Always dark
//     localStorage.setItem("theme", "Dark");
//   }, []);

//   const updateTheme = () => {}; // optional no-op, since theme is fixed

//   return { theme: "Dark", updateTheme };
// }
