"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Viewer =
  | { role: "dm" }
  | { role: "pc"; pcId?: string };

type ViewerContextValue = {
  viewer: Viewer;
  setViewer: (v: Viewer) => void;
};

const ViewerContext = createContext<ViewerContextValue | null>(null);

export function ViewerProvider({ children }: { children: React.ReactNode }) {
  const [viewer, setViewer] = useState<Viewer>({ role: "dm" });

  // persist in localStorage so dev refreshes keep your choice
  useEffect(() => {
    const raw = window.localStorage.getItem("ddt.viewer");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Viewer;
        if (parsed && (parsed.role === "dm" || parsed.role === "pc")) {
          setViewer(parsed);
        }
      } catch {}
    }
  }, []);
  useEffect(() => {
    window.localStorage.setItem("ddt.viewer", JSON.stringify(viewer));
  }, [viewer]);

  const value = useMemo(() => ({ viewer, setViewer }), [viewer]);
  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>;
}

export function useViewer() {
  const ctx = useContext(ViewerContext);
  if (!ctx) throw new Error("useViewer must be used within <ViewerProvider>");
  return ctx;
}
