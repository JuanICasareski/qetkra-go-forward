import { useRef, useState } from "react";
import { CheckCircle2, FileText, Trash2, UploadCloud } from "lucide-react";

// Documento cargado: solo metadatos en memoria. No se persiste en ningún lado
// (sin backend ni almacenamiento) — la lista es puramente visual.
export type UploadedDoc = {
  id: string;
  name: string;
  size: number;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function DocumentUploader(props: {
  docs: UploadedDoc[];
  onChange: (docs: UploadedDoc[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const added: UploadedDoc[] = Array.from(files).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
    }));
    props.onChange([...props.docs, ...added]);
  };

  const remove = (id: string) =>
    props.onChange(props.docs.filter((d) => d.id !== id));

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={[
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition",
          dragging
            ? "border-[var(--qk-blue)] bg-[var(--qk-blue-soft)]"
            : "border-[var(--qk-line)] bg-muted/20 hover:border-[var(--qk-blue)]/60 hover:bg-[var(--qk-blue-soft)]/50",
        ].join(" ")}
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-[var(--qk-blue-soft)] text-[var(--qk-blue)]">
          <UploadCloud className="size-5.5" />
        </span>
        <p className="text-sm font-medium text-[var(--qk-navy)]">
          Arrastrá tus archivos o hacé clic para seleccionar
        </p>
        <p className="text-xs text-muted-foreground">
          Podés subir tantos documentos como necesites — PDF, imágenes, planillas.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Documentación cargada
          </p>
          <span className="rounded-full bg-[var(--qk-blue-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--qk-blue-dark)]">
            {props.docs.length}
          </span>
        </div>

        {props.docs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[var(--qk-line)] px-4 py-6 text-center text-sm text-muted-foreground">
            Todavía no cargaste documentos.
          </p>
        ) : (
          <ul className="space-y-2">
            {props.docs.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-3 rounded-lg border border-[var(--qk-line)] bg-white px-3 py-2.5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[var(--qk-blue-soft)] text-[var(--qk-blue)]">
                  <FileText className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--qk-navy)]">
                    {d.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(d.size)}
                  </p>
                </div>
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                <button
                  type="button"
                  onClick={() => remove(d.id)}
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Quitar ${d.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
