import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { initialState, type FormState } from "./state";

type EvalContextValue = {
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

const EvalContext = createContext<EvalContextValue | null>(null);

// `initial` permite montar instancias anidadas del provider con otro
// estado de partida (p. ej. el editor de un producto ya guardado).
export function EvalProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: FormState;
}) {
  const [state, setState] = useState<FormState>(initial ?? initialState);

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
