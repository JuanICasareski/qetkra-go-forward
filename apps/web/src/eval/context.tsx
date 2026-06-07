import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { initialState, type FormState } from "./state";

type EvalContextValue = {
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

const EvalContext = createContext<EvalContextValue | null>(null);

export function EvalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FormState>(initialState);

  const value = useMemo<EvalContextValue>(
    () => ({
      state,
      setState,
      set: (key, value) => setState((prev) => ({ ...prev, [key]: value })),
    }),
    [state],
  );

  return <EvalContext.Provider value={value}>{children}</EvalContext.Provider>;
}

export function useEval(): EvalContextValue {
  const ctx = useContext(EvalContext);
  if (!ctx) throw new Error("useEval debe usarse dentro de <EvalProvider>");
  return ctx;
}
