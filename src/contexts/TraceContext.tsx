"use client";

import { TraceNode } from "@/types/trace";
import { createContext, useContext, useState, ReactNode } from "react";
import { create, StoreApi, useStore } from "zustand";

type ContextState = {
  trace: TraceNode | null;
  setTrace: (trace: TraceNode | null) => void;
};
const TraceContext = createContext<StoreApi<ContextState> | null>(null);

export const TraceContextProvider = ({ children }: { children: ReactNode }) => {
  const [value] = useState(() => {
    return create<ContextState>()((set) => ({
      trace: null,
      setTrace: (trace) => {
        set({ trace });
      },
    }));
  });

  return <TraceContext.Provider value={value}>{children}</TraceContext.Provider>;
};

export const useTrace = <T,>(selector: (state: ContextState) => T) => {
  const store = useContext(TraceContext);
  if (!store) {
    throw new Error("useTrace must be used within a useTrace");
  }
  return useStore(store, selector);
};
