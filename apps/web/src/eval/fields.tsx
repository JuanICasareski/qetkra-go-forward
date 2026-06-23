import { CircleHelp } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import type { Option } from "./metadata";

// Icono "?" con tooltip que explica el campo. Reutilizado por EnumField, TriBoolRow
// y el resumen de validación (ProductSummary).
export function HintIcon(props: { hint: string; label: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`Qué es: ${props.label}`}
            className="text-muted-foreground/60 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
          >
            <CircleHelp className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-left">
          {props.hint}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function EnumField<T extends string>(props: {
  label: string;
  value: T | undefined;
  options: readonly Option<T>[];
  onChange: (v: T) => void;
  anchorId?: string;
  hint?: string;
}) {
  return (
    <div id={props.anchorId} className="scroll-mt-24 space-y-1.5 rounded-lg">
      <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {props.label}
        {props.hint ? <HintIcon hint={props.hint} label={props.label} /> : null}
      </Label>
      <Select
        value={props.value ?? ""}
        onValueChange={(v) => props.onChange(v as T)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sin responder" />
        </SelectTrigger>
        <SelectContent>
          {props.options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Booleano estricto (sí/no), para campos que no admiten "sin responder",
// como la selección de países a evaluar.
export function BoolRow(props: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1.5">
      <span className="text-sm leading-snug">{props.label}</span>
      <Switch checked={props.checked} onCheckedChange={props.onChange} />
    </label>
  );
}

// Booleano tri-estado: sí / no / sin responder. Volver a clickear la
// opción activa la deselecciona y el campo queda sin responder.
export function TriBoolRow(props: {
  label: string;
  checked: boolean | undefined;
  onChange: (v: boolean | undefined) => void;
  anchorId?: string;
  hint?: string;
}) {
  const value =
    props.checked === undefined ? "" : props.checked ? "yes" : "no";

  return (
    <div
      id={props.anchorId}
      className="flex scroll-mt-24 items-center justify-between gap-3 rounded-lg px-1 py-1.5"
    >
      <span
        className={[
          "flex items-center gap-1.5 text-sm leading-snug",
          props.checked === undefined ? "text-muted-foreground" : "",
        ].join(" ")}
      >
        {props.label}
        {props.hint ? <HintIcon hint={props.hint} label={props.label} /> : null}
      </span>
      <ToggleGroup
        type="single"
        size="sm"
        variant="outline"
        spacing={1}
        value={value}
        onValueChange={(v) =>
          props.onChange(v === "" ? undefined : v === "yes")
        }
      >
        <ToggleGroupItem value="yes" aria-label={`${props.label}: sí`}>
          Sí
        </ToggleGroupItem>
        <ToggleGroupItem value="no" aria-label={`${props.label}: no`}>
          No
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
