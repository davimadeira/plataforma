"use client";

import { useEffect, useState } from "react";

type SiteTheme = "light" | "dark";

const storageKey = "matheus-vidal-site-theme";

export default function SiteThemeToggle() {
  const [theme, setTheme] = useState<SiteTheme>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const nextTheme: SiteTheme = saved === "light" || saved === "dark" ? saved : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.siteTheme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
  }, []);

  function toggleTheme() {
    setTheme(current => {
      const nextTheme: SiteTheme = current === "dark" ? "light" : "dark";
      window.localStorage.setItem(storageKey, nextTheme);
      document.documentElement.dataset.siteTheme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
      return nextTheme;
    });
  }

  const isDark = theme === "dark";
  return <button className="site-theme-toggle" type="button" onClick={toggleTheme} aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"} title={isDark ? "Ativar tema claro" : "Ativar tema escuro"}>
    <span aria-hidden="true">{isDark ? "☼" : "◐"}</span>
    <small>{isDark ? "Tema escuro" : "Tema claro"}</small>
  </button>;
}
