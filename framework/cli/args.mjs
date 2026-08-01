export function parseArguments(argv) {
  const positionals = []; const options = Object.create(null);
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--") { positionals.push(...argv.slice(index + 1)); break; }
    if (!token.startsWith("--")) { positionals.push(token); continue; }
    const equals = token.indexOf("="); const key = token.slice(2, equals < 0 ? undefined : equals);
    const value = equals >= 0 ? token.slice(equals + 1) : argv[index + 1] && !argv[index + 1].startsWith("--") ? argv[++index] : true;
    if (Object.hasOwn(options, key)) options[key] = Array.isArray(options[key]) ? [...options[key], value] : [options[key], value];
    else options[key] = value;
  }
  return Object.freeze({ positionals: Object.freeze(positionals), options: Object.freeze(options) });
}

export function optionList(options, name) { const value = options[name]; return value === undefined ? [] : Array.isArray(value) ? value : [value]; }
export function requiredOption(options, name) { if (options[name] === undefined || options[name] === true) throw new Error(`USAGE_OPTION_REQUIRED: --${name}`); return options[name]; }
export function numberOption(options, name, fallback = null) { if (options[name] === undefined) return fallback; const value = Number(options[name]); if (!Number.isFinite(value)) throw new Error(`USAGE_OPTION_NUMBER: --${name}`); return value; }
