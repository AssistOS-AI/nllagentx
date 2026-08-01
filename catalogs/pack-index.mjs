// Illustrative predefined-pack registry. Implementations should import actual pack modules.
import { packIndex, packRef, loadTier, knowledgeLevel } from "../framework/sdk/ontology/packs.mjs";

export default packIndex("nllAgent-basic-packs")
  .add(packRef("core-commonsense").tier(loadTier("baseline")).level(knowledgeLevel("lower-secondary")))
  .add(packRef("world-basic").tier(loadTier("baseline")).level(knowledgeLevel("lower-secondary")))
  .add(packRef("math-basic").tier(loadTier("domain")).level(knowledgeLevel("lower-secondary")))
  .add(packRef("physics-basic").tier(loadTier("domain")).level(knowledgeLevel("lower-secondary")))
  .add(packRef("chemistry-basic").tier(loadTier("domain")).level(knowledgeLevel("lower-secondary")))
  .add(packRef("biology-basic").tier(loadTier("domain")).level(knowledgeLevel("lower-secondary")))
  .add(packRef("psychology-basic").tier(loadTier("domain")).level(knowledgeLevel("lower-secondary")))
  .add(packRef("anthropology-basic").tier(loadTier("domain")).level(knowledgeLevel("lower-secondary")))
  .add(packRef("sociology-basic").tier(loadTier("domain")).level(knowledgeLevel("lower-secondary")))
  .add(packRef("logic-basic").tier(loadTier("core")).level(knowledgeLevel("lower-secondary")))
  .add(packRef("reasoning-errors").tier(loadTier("baseline")).level(knowledgeLevel("lower-secondary")))
  .add(packRef("law-basic").tier(loadTier("domain")).level(knowledgeLevel("civic-basic")))
  .add(packRef("social-interaction").tier(loadTier("baseline")).level(knowledgeLevel("lower-secondary")))
  .seal();
