import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("social-interaction.speech-acts", "1.0.0");
export const Interaction = O.entity(
  entityKind("Interaction").provide(capability("Interaction"))
);
export const SpeechAct = O.entity(
  entityKind("SpeechAct").provide(capability("SpeechAct"))
);
export const Conversation = O.entity(
  entityKind("Conversation").provide(capability("Conversation"))
);
export const Request = O.entity(
  entityKind("Request").provide(capability("Request"))
);
export const Order = O.entity(
  entityKind("Order").provide(capability("Order"))
);
export const Offer = O.entity(
  entityKind("Offer").provide(capability("Offer"))
);
export const Promise = O.entity(
  entityKind("Promise").provide(capability("Promise"))
);
export const Refusal = O.entity(
  entityKind("Refusal").provide(capability("Refusal"))
);
export const Apology = O.entity(
  entityKind("Apology").provide(capability("Apology"))
);
export const CommitmentState = O.entity(
  entityKind("CommitmentState").provide(capability("CommitmentState"))
);
export const DirectedTo = O.event(
  eventKind("DirectedTo")
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
    .provide(capability("DirectedTo"))
);
export const CommitsTo = O.event(
  eventKind("CommitsTo")
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
    .provide(capability("CommitsTo"))
);
export const Requests = O.event(
  eventKind("Requests")
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
    .provide(capability("Requests"))
);
O.lexicon(lexicalize(Interaction).english("interaction"));
O.lexicon(lexicalize(SpeechAct).english("speech act"));
O.lexicon(lexicalize(Conversation).english("conversation"));
O.lexicon(lexicalize(Request).english("request"));
O.lexicon(lexicalize(Order).english("order"));
O.lexicon(lexicalize(Offer).english("offer"));
O.lexicon(lexicalize(Promise).english("promise"));
O.lexicon(lexicalize(Refusal).english("refusal"));
O.lexicon(lexicalize(Apology).english("apology"));
O.lexicon(lexicalize(CommitmentState).english("commitment state"));
O.lexicon(lexicalize(DirectedTo).english("directed to"));
O.lexicon(lexicalize(CommitsTo).english("commits to"));
O.lexicon(lexicalize(Requests).english("requests"));

export default O.seal();
