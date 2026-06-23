import { useEval } from "./context";
import { EnumField, TriBoolRow } from "./fields";
import {
  BODY_AREAS,
  COMBINATION_PMOA,
  COMBINATION_SUBSTANCE,
  CONTACT_DURATIONS,
  DEVICE_TYPES,
  FIELD_HINTS,
  INVASIVENESS,
  IVD_INDIVIDUAL,
  IVD_RISK3,
  SAMD_SEVERITY,
  SAMD_SIGNIFICANCE,
} from "./metadata";
import { FIELD_ANCHOR } from "./state";

// Atributos base del producto (enums + activo).
export function ProductFields() {
  const { state, set } = useEval();
  return (
    <div className="space-y-3">
      <EnumField
        anchorId={FIELD_ANCHOR.base("device_type")}
        label="Tipo de dispositivo"
        hint={FIELD_HINTS.base.device_type}
        value={state.device_type}
        options={DEVICE_TYPES}
        onChange={(v) => set("device_type", v)}
      />
      <EnumField
        anchorId={FIELD_ANCHOR.base("invasiveness")}
        label="Invasividad"
        hint={FIELD_HINTS.base.invasiveness}
        value={state.invasiveness}
        options={INVASIVENESS}
        onChange={(v) => set("invasiveness", v)}
      />
      <EnumField
        anchorId={FIELD_ANCHOR.base("contact_nature")}
        label="Zona del cuerpo"
        hint={FIELD_HINTS.base.contact_nature}
        value={state.contact_nature}
        options={BODY_AREAS}
        onChange={(v) => set("contact_nature", v)}
      />
      <EnumField
        anchorId={FIELD_ANCHOR.base("contact_duration")}
        label="Duración de contacto"
        hint={FIELD_HINTS.base.contact_duration}
        value={state.contact_duration}
        options={CONTACT_DURATIONS}
        onChange={(v) => set("contact_duration", v)}
      />
      <TriBoolRow
        anchorId={FIELD_ANCHOR.base("is_active")}
        label="Dispositivo activo"
        hint={FIELD_HINTS.base.is_active}
        checked={state.is_active}
        onChange={(v) => set("is_active", v)}
      />
    </div>
  );
}

// Flags específicos según el tipo de dispositivo (SaMD / IVD / combinación).
export function TypeSpecificFields() {
  const { state, set } = useEval();

  if (state.device_type === undefined) {
    return (
      <p className="text-sm text-muted-foreground">
        Seleccioná un tipo de dispositivo para ver sus flags específicos.
      </p>
    );
  }

  if (state.device_type === "samd") {
    return (
      <div className="space-y-3">
        <EnumField
          anchorId={FIELD_ANCHOR.flag("samd", "significance")}
          label="Significancia (decisión clínica)"
          hint={FIELD_HINTS.samd.significance}
          value={state.samd.significance}
          options={SAMD_SIGNIFICANCE}
          onChange={(v) => set("samd", { ...state.samd, significance: v })}
        />
        <EnumField
          anchorId={FIELD_ANCHOR.flag("samd", "condition_severity")}
          label="Gravedad de la condición"
          hint={FIELD_HINTS.samd.condition_severity}
          value={state.samd.condition_severity}
          options={SAMD_SEVERITY}
          onChange={(v) => set("samd", { ...state.samd, condition_severity: v })}
        />
        <TriBoolRow
          anchorId={FIELD_ANCHOR.flag("samd", "is_ai_ml_enabled")}
          label="Habilitado por IA/ML"
          hint={FIELD_HINTS.samd.is_ai_ml_enabled}
          checked={state.samd.is_ai_ml_enabled}
          onChange={(v) => set("samd", { ...state.samd, is_ai_ml_enabled: v })}
        />
        <TriBoolRow
          anchorId={FIELD_ANCHOR.flag("samd", "controls_other_device")}
          label="Controla otro dispositivo"
          hint={FIELD_HINTS.samd.controls_other_device}
          checked={state.samd.controls_other_device}
          onChange={(v) => set("samd", { ...state.samd, controls_other_device: v })}
        />
      </div>
    );
  }

  if (state.device_type === "combination") {
    return (
      <div className="space-y-3">
        <EnumField
          anchorId={FIELD_ANCHOR.flag("combination", "primary_mode_of_action")}
          label="Modo de acción primario"
          hint={FIELD_HINTS.combination.primary_mode_of_action}
          value={state.combination.primary_mode_of_action}
          options={COMBINATION_PMOA}
          onChange={(v) =>
            set("combination", { ...state.combination, primary_mode_of_action: v })
          }
        />
        <EnumField
          anchorId={FIELD_ANCHOR.flag("combination", "substance_action")}
          label="Acción de la sustancia"
          hint={FIELD_HINTS.combination.substance_action}
          value={state.combination.substance_action}
          options={COMBINATION_SUBSTANCE}
          onChange={(v) =>
            set("combination", { ...state.combination, substance_action: v })
          }
        />
        <TriBoolRow
          anchorId={FIELD_ANCHOR.flag("combination", "is_integral")}
          label="Producto integral"
          hint={FIELD_HINTS.combination.is_integral}
          checked={state.combination.is_integral}
          onChange={(v) =>
            set("combination", { ...state.combination, is_integral: v })
          }
        />
      </div>
    );
  }

  if (state.device_type === "ivd") {
    return (
      <div className="space-y-3">
        <EnumField
          anchorId={FIELD_ANCHOR.flag("ivd", "public_health_risk")}
          label="Riesgo de salud pública"
          hint={FIELD_HINTS.ivd.public_health_risk}
          value={state.ivd.public_health_risk}
          options={IVD_RISK3}
          onChange={(v) => set("ivd", { ...state.ivd, public_health_risk: v })}
        />
        <EnumField
          anchorId={FIELD_ANCHOR.flag("ivd", "individual_risk")}
          label="Riesgo individual"
          hint={FIELD_HINTS.ivd.individual_risk}
          value={state.ivd.individual_risk}
          options={IVD_INDIVIDUAL}
          onChange={(v) => set("ivd", { ...state.ivd, individual_risk: v })}
        />
        <TriBoolRow
          anchorId={FIELD_ANCHOR.flag("ivd", "detects_transmissible_agent")}
          label="Detecta agente transmisible"
          hint={FIELD_HINTS.ivd.detects_transmissible_agent}
          checked={state.ivd.detects_transmissible_agent}
          onChange={(v) =>
            set("ivd", { ...state.ivd, detects_transmissible_agent: v })
          }
        />
        <TriBoolRow
          anchorId={FIELD_ANCHOR.flag("ivd", "is_self_testing")}
          label="Autodiagnóstico"
          hint={FIELD_HINTS.ivd.is_self_testing}
          checked={state.ivd.is_self_testing}
          onChange={(v) => set("ivd", { ...state.ivd, is_self_testing: v })}
        />
        <TriBoolRow
          anchorId={FIELD_ANCHOR.flag("ivd", "is_near_patient_testing")}
          label="Point-of-care"
          hint={FIELD_HINTS.ivd.is_near_patient_testing}
          checked={state.ivd.is_near_patient_testing}
          onChange={(v) =>
            set("ivd", { ...state.ivd, is_near_patient_testing: v })
          }
        />
        <TriBoolRow
          anchorId={FIELD_ANCHOR.flag("ivd", "is_control_or_calibrator")}
          label="Control / calibrador"
          hint={FIELD_HINTS.ivd.is_control_or_calibrator}
          checked={state.ivd.is_control_or_calibrator}
          onChange={(v) =>
            set("ivd", { ...state.ivd, is_control_or_calibrator: v })
          }
        />
        <TriBoolRow
          anchorId={FIELD_ANCHOR.flag("ivd", "is_screening_or_staging")}
          label="Tamizaje / estadificación"
          hint={FIELD_HINTS.ivd.is_screening_or_staging}
          checked={state.ivd.is_screening_or_staging}
          onChange={(v) =>
            set("ivd", { ...state.ivd, is_screening_or_staging: v })
          }
        />
      </div>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      N/A — este tipo de dispositivo no tiene flags específicos.
    </p>
  );
}
