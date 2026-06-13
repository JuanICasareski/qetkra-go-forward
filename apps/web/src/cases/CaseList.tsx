import { Download } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { COUNTRIES } from "@/eval/metadata";
import { formatDate } from "@/products/meta";
import { useStore } from "@/store/context";

import {
  buildHelenaDataset,
  canExport,
  downloadHelenaCsv,
  downloadHelenaJson,
} from "./export";
import { CASE_STATUS_LABEL, CASE_STATUS_STYLE, CERTITUDE_LABEL } from "./meta";

const countryLabel = (code: string) =>
  COUNTRIES.find((c) => c.value === code)?.label ?? code.toUpperCase();

export function CaseList() {
  const { cases, products } = useStore();
  const ordered = [...cases].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Trámites</h2>
          <p className="text-sm text-muted-foreground">
            Una homologación por producto por país.
          </p>
        </div>
        <Button asChild>
          <Link to="/cases/new">Nuevo trámite</Link>
        </Button>
      </div>

      {ordered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Todavía no iniciaste ningún trámite.
          </CardContent>
        </Card>
      ) : (
        ordered.map((c) => {
          const product = products.find((p) => p.id === c.productId);
          const exportable = canExport(product, c);
          return (
            <Card key={c.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">
                      {product?.name ?? "Producto eliminado"}
                    </p>
                    <Badge className={CASE_STATUS_STYLE[c.status]}>
                      {CASE_STATUS_LABEL[c.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {countryLabel(c.country)} · iniciado {formatDate(c.createdAt)} ·
                    reglas v{c.rulesVersion}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Clase: <span className="font-medium">{c.finalClass}</span> ·{" "}
                    {CERTITUDE_LABEL[c.certitude]}
                  </p>
                  {c.reviewNote && (
                    <p className="text-xs text-muted-foreground">
                      Nota del staff: {c.reviewNote}
                    </p>
                  )}
                </div>

                {/* Flujo 6: el expediente solo se exporta una vez clasificado. */}
                {exportable && product && (
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadHelenaJson(buildHelenaDataset(product, c))}
                    >
                      <Download className="size-4" /> JSON
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadHelenaCsv(buildHelenaDataset(product, c))}
                    >
                      <Download className="size-4" /> CSV
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
