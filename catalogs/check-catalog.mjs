// Illustrative high-level check catalog. Domain packs provide the actual circuits.
import { checkCatalog, checkFamily, targetText, concern, outputKind } from "../framework/sdk/circuit/catalog.mjs";

export default checkCatalog("nllAgent-checks")
  .add(checkFamily("general-semantic").targets(targetText("all")).concerns(concern("identity"), concern("time"), concern("scope"), concern("contradiction")))
  .add(checkFamily("literary").targets(targetText("narrative")).concerns(concern("continuity"), concern("motivation"), concern("point-of-view"), concern("plot-obligation")))
  .add(checkFamily("legal-policy").targets(targetText("normative")).concerns(concern("definition"), concern("authority"), concern("procedure"), concern("exception")))
  .add(checkFamily("textbook-manual").targets(targetText("educational")).concerns(concern("prerequisite-order"), concern("example-consistency"), concern("units")))
  .add(checkFamily("scientific").targets(targetText("scientific")).concerns(concern("evidence"), concern("causality"), concern("uncertainty"), concern("methods-results")))
  .add(checkFamily("argument").targets(targetText("argumentative")).concerns(concern("support"), concern("fallacy"), concern("quantifier"), concern("counterargument")))
  .add(checkFamily("controlled-generation").targets(targetText("generation")).outputs(outputKind("CNLFrame"), outputKind("GenerationPlan"), outputKind("RepairFrame")))
  .seal();
