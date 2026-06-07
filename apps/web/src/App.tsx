import { useState } from "react";
import { Button } from "@/components/ui/button";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="grid min-h-screen place-items-center gap-4 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">web</h1>
        <p className="text-muted-foreground">
          React + Vite + TypeScript + Tailwind + shadcn/ui
        </p>
        <Button onClick={() => setCount((c) => c + 1)}>count is {count}</Button>
      </div>
    </main>
  );
}
