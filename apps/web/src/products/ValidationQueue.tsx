import { Link, Navigate, useNavigate, useParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { missingFields } from "@/eval/state";
import { useStore } from "@/store/context";

import { formatDate } from "./meta";
import { ProductSummary } from "./ProductSummary";

// Cola de validación (staff): productos enviados por clientes esperando
// que un empleado de Qetkra valide sus propiedades.
export function ValidationQueue() {
  const { products } = useStore();
  const pending = products.filter((p) => p.status === "pending_validation");

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Validación de productos</h2>
        <p className="text-sm text-muted-foreground">
          {pending.length} producto(s) esperando validación del staff.
        </p>
      </div>

      {pending.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No hay productos pendientes de validación.
          </CardContent>
        </Card>
      ) : (
        pending.map((p) => {
          const missing = missingFields(p.data).length;
          return (
            <Card key={p.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.manufacturer} · enviado {formatDate(p.updatedAt)}
                  </p>
                  {missing > 0 && (
                    <Badge variant="outline" className="mt-1 text-muted-foreground">
                      {missing} propiedad(es) sin responder
                    </Badge>
                  )}
                </div>
                <Button asChild size="sm">
                  <Link to={`/validation/${p.id}`}>Revisar</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

export function ValidationReview() {
  const { id } = useParams();
  const { products, setProductStatus } = useStore();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);
  if (!product || product.status !== "pending_validation")
    return <Navigate to="/validation" replace />;

  const missing = missingFields(product.data);

  const resolve = (approved: boolean) => {
    setProductStatus(product.id, approved ? "validated" : "rejected");
    navigate("/validation");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="text-sm text-muted-foreground">
            {product.manufacturer} · enviado {formatDate(product.updatedAt)}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/validation")}>
          Volver a la cola
        </Button>
      </div>

      {missing.length > 0 && (
        <Card>
          <CardContent className="py-3 text-sm text-muted-foreground">
            Este producto tiene {missing.length} propiedad(es) sin responder:
            no se podrá determinar su clase hasta que el cliente las complete.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Propiedades declaradas</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductSummary data={product.data} />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => resolve(false)}>
          Observar (devolver al cliente)
        </Button>
        <Button onClick={() => resolve(true)}>Validar propiedades</Button>
      </div>
    </div>
  );
}
