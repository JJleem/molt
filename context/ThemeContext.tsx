"use client";
import React, { createContext, useContext } from "react";

// 라이트 전용 — 다크모드 제거. useTheme API는 유지(항상 light)해서
// 기존 소비처(GithubStatus 등)가 깨지지 않게 한다.
type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {} }}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);
