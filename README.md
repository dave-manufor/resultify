<h1 align="center">Resultify</h1>

<p align="center">
	<strong>A lightweight, type-safe <code>Result</code> type for functional error handling in TypeScript (and JS).</strong><br>
	Provides <code>Ok</code> and <code>Err</code> variants for clear, expressive success and failure management in your code.
</p>

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Type Safety](#type-safety)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Type-safe**: Enforces explicit handling of success and error cases.
- **Functional**: Inspired by Rust and FP paradigms, with `Ok` and `Err` variants.
- **Lightweight**: Zero dependencies, minimal footprint.
- **Expressive**: Clear API for mapping, unwrapping, and error propagation.
- **Custom Error Types**: Supports custom error classes for richer error handling.

---

## Installation

```bash
npm install @davemanufor/resultify
# or
yarn add @davemanufor/resultify
```

---

## Usage

Import the factory and types:

```typescript
import { Result, Ok, Err } from "resultify";

// Create an Ok result
const ok = Result.ok(42);

// Create an Err result
const err = Result.err(new Error("Something went wrong"));

// Type narrowing
if (ok.isOk()) {
  console.log("Success:", ok.unwrap());
}
if (err.isError()) {
  console.error("Error:", err.unwrapError());
}
```

---

## API Reference

### Types

- `Result<T, E extends Error = Error>`: Union type of `Ok<T, E>` and `Err<T, E>`
- `Ok<T, E>`: Represents a successful result
- `Err<T, E>`: Represents an error result

### Factory

- `Result.ok<T, E>(value: T): Ok<T, E>`
- `Result.err<T, E>(error: E): Err<T, E>`

### Methods

#### Common

- `isOk(): boolean` — Returns true if result is Ok
- `isError(): boolean` — Returns true if result is Err

#### Ok

- `unwrap(): T` — Returns the value
- `unwrapError(): never` — Throws if called on Ok
- `throwError(): void` — No-op for Ok
- `map<U>(fn: (value: T) => U): Ok<U, E>` — Maps value

#### Err

- `unwrap(): never` — Throws if called on Err
- `unwrapError(): E` — Returns the error
- `throwError(): void` — Throws the error
- `map<U>(fn: (value: T) => U): Err<U, E>` — Passes error through

---

## Type Safety

You can use custom error types for richer error handling:

```typescript
class MyError extends Error {}
const result: Result<string, MyError> = Result.err(new MyError("fail"));
if (result.isError()) {
  result.throwError(); // Throws MyError
}
```

---

## Examples

### Basic Usage

```typescript
function parseNumber(str: string): Result<number, Error> {
  const n = Number(str);
  if (isNaN(n)) return Result.err(new Error("Not a number"));
  return Result.ok(n);
}

const res = parseNumber("123");
if (res.isOk()) {
  console.log("Parsed:", res.unwrap());
} else {
  console.error("Parse error:", res.unwrapError().message);
}
```

### Mapping Values

```typescript
const ok = Result.ok(2);
const mapped = ok.map((x) => x * 5); // Ok(10)

const err = Result.err<number>(new Error("fail"));
const mappedErr = err.map((x) => x * 2); // Err("fail")
```

### Error Propagation

```typescript
function mightFail(flag: boolean): Result<string, Error> {
  if (flag) return Result.ok("success");
  return Result.err(new Error("fail"));
}

const result = mightFail(false);
result.throwError(); // Throws Error("fail") if Err
```

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues](https://github.com/dave-manufor/resultify/issues) and submit PRs.

---

## License

MIT © David Manufor
