// --- 1. The Abstract Class ---

abstract class BaseResult<T, E extends Error = Error> {
  protected constructor(protected readonly _isOk: boolean) {}

  isOk(): this is Ok<T, E> {
    return this._isOk;
  }

  isError(): this is Err<T, E> {
    return !this._isOk;
  }

  abstract unwrap(): T;
  abstract unwrapError(): E;
  abstract throwError(): void;

  abstract map<U>(fn: (value: T) => U): Result<U, E>;
}

// --- 2. The Concrete Classes ---
export class Ok<T, E extends Error = Error> extends BaseResult<T, E> {
  public readonly value: T;

  constructor(value: T) {
    super(true);
    this.value = value;
  }

  unwrap(): T {
    return this.value;
  }

  unwrapError(): E {
    throw new Error("Called unwrapError on an Ok value");
  }

  throwError(): void {
    // Do nothing
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return new Ok(fn(this.value));
  }
}

export class Err<T, E extends Error = Error> extends BaseResult<T, E> {
  public readonly error: E;

  constructor(error: E) {
    super(false);
    this.error = error;
  }

  unwrap(): T {
    throw new Error(`Called unwrap on an Err value: ${this.error.message}`);
  }

  unwrapError(): E {
    return this.error;
  }

  throwError(): void {
    throw this.error;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    // Pass the error through, just changing the <T> type
    return this as unknown as Err<U, E>;
  }
}

// --- 2. The Public Type Alias ---

export type Result<T, E extends Error = Error> = Ok<T, E> | Err<T, E>;

// --- 3. The Factory Object ---

export const Result = {
  ok: <T, E extends Error = Error>(value: T): Ok<T, E> => {
    return new Ok(value);
  },

  err: <T, E extends Error = Error>(error: E): Err<T, E> => {
    return new Err(error);
  },
};
