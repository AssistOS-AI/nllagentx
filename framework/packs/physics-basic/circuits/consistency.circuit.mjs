import { createCheckCircuit } from "../../shared/check-runtime.mjs";

export const DimensionAndUnitFinding = createCheckCircuit("physics-basic", "DimensionAndUnitFinding", ["physics-basic.models-units:Measurement"]);
export const KinematicsFinding = createCheckCircuit("physics-basic", "KinematicsFinding", ["physics-basic.motion:MotionState"]);
export const ForceBalanceFinding = createCheckCircuit("physics-basic", "ForceBalanceFinding", ["physics-basic.forces:Force"]);
export const EnergyAccountingFinding = createCheckCircuit("physics-basic", "EnergyAccountingFinding", ["physics-basic.energy:Energy"]);
export const ThermalDirectionFinding = createCheckCircuit("physics-basic", "ThermalDirectionFinding", ["physics-basic.thermal:Temperature"]);
export const WaveRelationFinding = createCheckCircuit("physics-basic", "WaveRelationFinding", ["physics-basic.waves:Wave"]);
export const SimpleCircuitFinding = createCheckCircuit("physics-basic", "SimpleCircuitFinding", ["physics-basic.electricity-magnetism:ElectricCircuit"]);
export const ModelAssumptionFinding = createCheckCircuit("physics-basic", "ModelAssumptionFinding", ["physics-basic.models-units:ModelAssumption"]);

export default Object.freeze([DimensionAndUnitFinding, KinematicsFinding, ForceBalanceFinding, EnergyAccountingFinding, ThermalDirectionFinding, WaveRelationFinding, SimpleCircuitFinding, ModelAssumptionFinding]);
