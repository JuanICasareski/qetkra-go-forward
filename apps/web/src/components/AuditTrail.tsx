// Historial de auditoría de una entidad (Flujo 7). Lista quién y cuándo
// cambió cada propiedad/estado, con valor anterior y nuevo. Reusable en el
// detalle de producto y de trámite.
import { CASE_STATUS_LABEL } from "@/cases/meta";
import { formatDate, STATUS_LABEL } from "@/products/meta";
import { useStore } from "@/store/context";
import type { AuditEntity, CaseStatus, ProductStatus, Role } from "@/store/types";

const ROLE_LABEL: Record<Role, string> = {
  client: "Cliente",
  staff: "Staff Qetkra",
};

// Las transiciones de estado se guardan con la clave cruda; las traducimos
// a la etiqueta visible según el tipo de entidad.
const prettyStatus = (entity: AuditEntity, value: string | undefined) => {
  if (value === undefined) return undefined;
  if (entity === "product")
    return STATUS_LABEL[value as ProductStatus] ?? value;
  return CASE_STATUS_LABEL[value as CaseStatus] ?? value;
};

export function AuditTrail({
  entity,
  entityId,
}: {
  entity: AuditEntity;
  entityId: string;
}) {
  const { auditFor } = useStore();
  const entries = auditFor(entity, entityId);

  if (entries.length === 0)
    return (
      <p className="text-sm text-muted-foreground">
        Sin movimientos registrados todavía.
      </p>
    );

  return (
    <ol className="space-y-3">
      {entries.map((e) => {
        const isStatus = e.field === "Estado";
        const before = isStatus ? prettyStatus(entity, e.before) : e.before;
        const after = isStatus ? prettyStatus(entity, e.after) : e.after;
        return (
          <li key={e.id} className="border-l-2 border-muted pl-3 text-sm">
            <p className="font-medium">{e.action}</p>
            {e.field && (
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground/80">{e.field}</span>
                {before !== undefined && after !== undefined && (
                  <>
                    {": "}
                    <span className="line-through">{before}</span>
                    {" → "}
                    <span className="text-foreground">{after}</span>
                  </>
                )}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {ROLE_LABEL[e.actor]} · {formatDate(e.timestamp)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
