"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

const DebugTheme = () => {
  const { theme } = useTheme();

  useEffect(() => {
    console.log("Current theme:", theme);
  }, [theme]);

  return null;
};

export default DebugTheme;
