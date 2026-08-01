function next(seed) { return (BigInt(seed) * 6364136223846793005n + 1442695040888963407n) & ((1n << 64n) - 1n); }
export function* truthAssignments(names) {
  for (let mask = 0; mask < 2 ** names.length; mask += 1) yield new Map(names.map((name, index) => [name, Boolean(mask & (1 << index))]));
}
export function* quantityBoundary(limit) { for (const delta of [-1, 0, 1]) yield limit + delta; }
export function* intervalCases(maximum = 4) { for (let a = 0; a < maximum; a += 1) for (let b = a + 1; b <= maximum; b += 1) yield [a, b]; }
export function deterministicSample(values, seed = 1n, count = values.length) { const pool = [...values]; const selected = []; let state = BigInt(seed); while (pool.length && selected.length < count) { state = next(state); selected.push(pool.splice(Number(state % BigInt(pool.length)), 1)[0]); } return Object.freeze(selected); }
