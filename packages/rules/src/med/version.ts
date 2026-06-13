// Versión del cuerpo de reglas regulatorias (Flujo 7 — versionado).
// Cada EvaluationResult la incluye y cada trámite (Case) la persiste, de
// modo que un producto aprobado quede vinculado a la versión de norma con
// la que se evaluó. Al cambiar una regla se sube esta versión y los
// trámites viejos conservan la suya (no se pierde la trazabilidad).
export const RULES_VERSION = "1.0.0";
