import { digestIdentity } from "../../sdk/core/identity.mjs";

export class ExecutionTrace {
  #events = [];
  record(kind, details = {}) {
    const event = Object.freeze({
      id: digestIdentity("nll.trace-event", { index: this.#events.length, kind, details }),
      index: this.#events.length,
      kind,
      ...details
    });
    this.#events.push(event);
    return event;
  }
  events() { return [...this.#events]; }
  slice({ from = null, to = null, kinds = null } = {}) {
    const selected = this.#events.filter((event) => (!from || event.index >= from) && (!to || event.index <= to) && (!kinds || kinds.includes(event.kind)));
    return Object.freeze(selected);
  }
  backward(value) {
    const identity = (typeof value?.identity === "function" ? value.identity() : value?.identity) ?? value;
    const selected = new Set();
    const queue = [identity];
    while (queue.length) {
      const current = queue.shift();
      for (const event of this.#events) {
        const outputs = (event.outputs ?? []).map((item) => (typeof item?.identity === "function" ? item.identity() : item?.identity) ?? item);
        if (!outputs.includes(current) || selected.has(event.index)) continue;
        selected.add(event.index);
        queue.push(...(event.inputs ?? []).map((item) => (typeof item?.identity === "function" ? item.identity() : item?.identity) ?? item));
      }
    }
    return Object.freeze([...selected].sort((a, b) => a - b).map((index) => this.#events[index]));
  }
}
