import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("sociology-basic.actors-groups", "1.0.0");
export const IndividualActor = O.entity(
  entityKind("IndividualActor").provide(capability("IndividualActor"))
);
export const Group = O.entity(
  entityKind("Group").provide(capability("Group"))
);
export const Organization = O.entity(
  entityKind("Organization").provide(capability("Organization"))
);
export const Population = O.entity(
  entityKind("Population").provide(capability("Population"))
);
export const SocialCategory = O.entity(
  entityKind("SocialCategory").provide(capability("SocialCategory"))
);
export const IndividualLevel = O.entity(
  entityKind("IndividualLevel").provide(capability("IndividualLevel"))
);
export const InteractionLevel = O.entity(
  entityKind("InteractionLevel").provide(capability("InteractionLevel"))
);
export const GroupLevel = O.entity(
  entityKind("GroupLevel").provide(capability("GroupLevel"))
);
export const OrganizationLevel = O.entity(
  entityKind("OrganizationLevel").provide(capability("OrganizationLevel"))
);
export const PopulationLevel = O.entity(
  entityKind("PopulationLevel").provide(capability("PopulationLevel"))
);
export const MemberOf = O.event(
  eventKind("MemberOf")
    .role(allows(actor, atMostOne()))
    .role(allows(theme, atMostOne()))
    .role(allows(subject, atMostOne()))
    .role(allows(objectRole, atMostOne()))
    .role(allows(source, atMostOne()))
    .role(allows(target, atMostOne()))
    .role(allows(location, atMostOne()))
    .role(allows(time, atMostOne()))
    .role(allows(context, atMostOne()))
    .role(allows(evidence, atMostOne()))
    .role(allows(value, atMostOne()))
    .role(allows(sourceFrom, atMostOne()))
    .role(allows(destination, atMostOne()))
    .provide(capability("MemberOf"))
);
O.lexicon(lexicalize(IndividualActor).english("individual actor"));
O.lexicon(lexicalize(Group).english("group"));
O.lexicon(lexicalize(Organization).english("organization"));
O.lexicon(lexicalize(Population).english("population"));
O.lexicon(lexicalize(SocialCategory).english("social category"));
O.lexicon(lexicalize(IndividualLevel).english("individual level"));
O.lexicon(lexicalize(InteractionLevel).english("interaction level"));
O.lexicon(lexicalize(GroupLevel).english("group level"));
O.lexicon(lexicalize(OrganizationLevel).english("organization level"));
O.lexicon(lexicalize(PopulationLevel).english("population level"));
O.lexicon(lexicalize(MemberOf).english("member of"));

export default O.seal();
