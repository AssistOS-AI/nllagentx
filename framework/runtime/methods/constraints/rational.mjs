function gcd(left, right) {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

export class Rational {
  constructor(numerator, denominator = 1n) {
    let n = BigInt(numerator);
    let d = BigInt(denominator);
    if (d === 0n) throw new RangeError("RATIONAL_DIVISION_BY_ZERO");
    if (d < 0n) { n = -n; d = -d; }
    const divisor = gcd(n, d);
    this.numerator = n / divisor;
    this.denominator = d / divisor;
    Object.freeze(this);
  }
  add(other) { const r = Rational.from(other); return new Rational(this.numerator * r.denominator + r.numerator * this.denominator, this.denominator * r.denominator); }
  subtract(other) { const r = Rational.from(other); return new Rational(this.numerator * r.denominator - r.numerator * this.denominator, this.denominator * r.denominator); }
  multiply(other) { const r = Rational.from(other); return new Rational(this.numerator * r.numerator, this.denominator * r.denominator); }
  divide(other) { const r = Rational.from(other); return new Rational(this.numerator * r.denominator, this.denominator * r.numerator); }
  negate() { return new Rational(-this.numerator, this.denominator); }
  abs() { return this.numerator < 0n ? this.negate() : this; }
  compare(other) { const r = Rational.from(other); const delta = this.numerator * r.denominator - r.numerator * this.denominator; return delta < 0n ? -1 : delta > 0n ? 1 : 0; }
  equals(other) { return this.compare(other) === 0; }
  toNumber() { return Number(this.numerator) / Number(this.denominator); }
  toString() { return this.denominator === 1n ? String(this.numerator) : `${this.numerator}/${this.denominator}`; }
  static from(value) {
    if (value instanceof Rational) return value;
    if (typeof value === "bigint" || Number.isInteger(value)) return new Rational(value);
    if (typeof value === "number") return Rational.parse(String(value));
    return Rational.parse(value);
  }
  static parse(value) {
    const text = String(value).trim();
    if (/^[+-]?\d+\/\d+$/.test(text)) { const [n, d] = text.split("/"); return new Rational(n, d); }
    if (/^[+-]?\d+$/.test(text)) return new Rational(text);
    const decimal = text.match(/^([+-]?)(\d*)\.(\d+)$/);
    if (!decimal) throw new TypeError(`Invalid rational: ${text}`);
    const scale = 10n ** BigInt(decimal[3].length);
    const magnitude = BigInt(`${decimal[2] || "0"}${decimal[3]}`);
    return new Rational(decimal[1] === "-" ? -magnitude : magnitude, scale);
  }
}

export const lcm = (left, right) => {
  const a = BigInt(left); const b = BigInt(right);
  return (a / gcd(a, b)) * b;
};
