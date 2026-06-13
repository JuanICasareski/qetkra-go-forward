import { Link, useNavigate } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { missingFields } from "@/eval/state";
import { useStore } from "@/store/context";
import type { Product } from "@/store/types";

import { formatDate, STATUS_LABEL, STATUS_STYLE } from "./meta";

function ProductRow({ product }: { product: Product }) {
  const { setProductStatus, deleteProduct } = useStore();
  const navigate = useNavigate();
  const missing = missingFields(product.data).length;

  // El cliente no puede tocar el producto mientras el staff lo revisa.
  const editable = product.status !== "pending_validation";

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{product.name}</p>
            <Badge className={STATUS_STYLE[product.status]}>
              {STATUS_LABEL[product.status]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {product.manufacturer} · actualizado {formatDate(product.updatedAt)}
          </p>
          <p className="text-xs text-muted-foreground">
            {missing === 0
              ? "Propiedades completas"
              : `${missing} propiedad(es) sin responder — no se podrá determinar la clase`}
          </p>
        </div>

        <div className="flex gap-2">
          {product.status === "draft" && (
            <Button
              size="sm"
              onClick={() => setProductStatus(product.id, "pending_validation")}
            >
              Enviar a validación
            </Button>
          )}
          {editable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/products/${product.id}/edit`)}
            >
              Editar
            </Button>
          )}
          {product.status === "draft" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteProduct(product.id)}
            >
              Eliminar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductList() {
  const { products } = useStore();

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Mis productos</h2>
          <p className="text-sm text-muted-foreground">
            Productos cargados para certificar con Qetkra.
          </p>
        </div>
        <Button asChild>
          <Link to="/products/new">Nuevo producto</Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Todavía no cargaste ningún producto.
          </CardContent>
        </Card>
      ) : (
        products.map((p) => <ProductRow key={p.id} product={p} />)
      )}
    </div>
  );
}
