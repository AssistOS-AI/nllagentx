import coreLanguage from "./core-language/pack.mjs";
import coreCommonsense from "./core-commonsense/pack.mjs";
import worldBasic from "./world-basic/pack.mjs";
import mathBasic from "./math-basic/pack.mjs";
import physicsBasic from "./physics-basic/pack.mjs";
import chemistryBasic from "./chemistry-basic/pack.mjs";
import biologyBasic from "./biology-basic/pack.mjs";
import psychologyBasic from "./psychology-basic/pack.mjs";
import anthropologyBasic from "./anthropology-basic/pack.mjs";
import sociologyBasic from "./sociology-basic/pack.mjs";
import logicBasic from "./logic-basic/pack.mjs";
import reasoningErrors from "./reasoning-errors/pack.mjs";
import lawBasic from "./law-basic/pack.mjs";
import socialInteraction from "./social-interaction/pack.mjs";

export const frameworkPacks = Object.freeze([
  coreLanguage, coreCommonsense, worldBasic, mathBasic, physicsBasic, chemistryBasic, biologyBasic,
  psychologyBasic, anthropologyBasic, sociologyBasic, logicBasic, reasoningErrors, lawBasic, socialInteraction
]);
export const frameworkPackMap = Object.freeze(new Map(frameworkPacks.map((pack) => [pack.id, pack])));
export function frameworkPack(id) { return frameworkPackMap.get(id) ?? null; }
