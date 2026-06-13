import { useEval } from "./context";
import { EnumField, TriBoolRow } from "./fields";
import {
  BODY_AREAS,
  COMBINATION_PMOA,
  COMBINATION_SUBSTANCE,
  CONTACT_DURATIONS,
  DEVICE_TYPES,
  INVASIVENESS,
  IVD_INDIVIDUAL,
  IVD_RISK3,
  SAMD_SEVERITY,
  SAMD_SIGNIFICANCE,
} from "./metadata";

// Atributos base del producto (enums + activo).
export function ProductFields() {
  const { state, set } = useEval();
  return (
    <div className="space-y-3">
      <EnumField
        label="Tipo de dispositivo"
        value={state.device_type}
        options={DEVICE_TYPES}
        onChange={(v) => set("device_type", v)}
      />
      <EnumField
        label="Invasividad"
        value={state.invasiveness}
        options={INVASIVENESS}
        onChange={(v) => set("invasiveness", v)}
      />
      <EnumField
        label="Zona del cuerpo"
        value={state.contact_nature}
        options={BODY_AREAS}
        onChange={(v) => set("contact_nature", v)}
      />
      <EnumField
        label="Duración de contacto"
        value={state.contact_duration}
        options={CONTACT_DURATIONS}
        onChange={(v) => set("contact_duration", v)}
      />
      <TriBoolRow
        label="Dispositivo activo"
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
          label="Significancia (decisión clínica)"
          value={state.samd.significance}
          options={SAMD_SIGNIFICANCE}
          onChange={(v) => set("samd", { ...state.samd, significance: v })}
        />
        <EnumField
          label="Gravedad de la condición"
          value={state.samd.condition_severity}
          options={SAMD_SEVERITY}
          onChange={(v) => set("samd", { ...state.samd, condition_severity: v })}
        />
        <TriBoolRow
          label="Habilitado por IA/ML"
          checked={state.samd.is_ai_ml_enabled}
          onChange={(v) => set("samd", { ...state.samd, is_ai_ml_enabled: v })}
        />
        <TriBoolRow
          label="Controla otro dispositivo"
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
          label="Modo de acción primario"
          value={state.combination.primary_mode_of_action}
          options={COMBINATION_PMOA}
          onChange={(v) =>
            set("combination", { ...state.combination, primary_mode_of_action: v })
          }
        />
        <EnumField
          label="Acción de la sustancia"
          value={state.combination.substance_action}
          options={COMBINATION_SUBSTANCE}
          onChange={(v) =>
            set("combination", { ...state.combination, substance_action: v })
          }
        />
        <TriBoolRow
          label="Producto integral"
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
          label="Riesgo de salud pública"
          value={state.ivd.public_health_risk}
          options={IVD_RISK3}
          onChange={(v) => set("ivd", { ...state.ivd, public_health_risk: v })}
        />
        <EnumField
          label="Riesgo individual"
          value={state.ivd.individual_risk}
          options={IVD_INDIVIDUAL}
          onChange={(v) => set("ivd", { ...state.ivd, individual_risk: v })}
        />
        <TriBoolRow
          label="Detecta agente transmisible"
          checked={state.ivd.detects_transmissible_agent}
          onChange={(v) =>
            set("ivd", { ...state.ivd, detects_transmissible_agent: v })
          }
        />
        <TriBoolRow
          label="Autodiagnóstico"
          checked={state.ivd.is_self_testing}
          onChange={(v) => set("ivd", { ...state.ivd, is_self_testing: v })}
        />
        <TriBoolRow
          label="Point-of-care"
          checked={state.ivd.is_near_patient_testing}
          onChange={(v) =>
            set("ivd", { ...state.ivd, is_near_patient_testing: v })
          }
        />
        <TriBoolRow
          label="Control / calibrador"
          checked={state.ivd.is_control_or_calibrator}
          onChange={(v) =>
            set("ivd", { ...state.ivd, is_control_or_calibrator: v })
          }
        />
        <TriBoolRow
          label="Tamizaje / estadificación"
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
