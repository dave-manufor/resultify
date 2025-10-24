import { Result, Ok, Err } from "../src/Result";

describe("Result Factory", () => {
  it("should create Ok and Err results", () => {
    const ok = Result.ok(123);
    const err = Result.err(new Error("fail"));
    expect(ok).toBeInstanceOf(Ok);
    expect(err).toBeInstanceOf(Err);
    expect(ok.isOk()).toBe(true);
    expect(err.isError()).toBe(true);
  });
});

describe("Ok class", () => {
  it("unwrap returns value", () => {
    const ok = new Ok("success");
    expect(ok.unwrap()).toBe("success");
  });
  it("unwrapError throws", () => {
    const ok = new Ok(42);
    expect(() => ok.unwrapError()).toThrow("Called unwrapError on an Ok value");
  });
  it("throwError does nothing", () => {
    const ok = new Ok(42);
    expect(() => ok.throwError()).not.toThrow();
  });
  it("map transforms value", () => {
    const ok = new Ok(2);
    const mapped = ok.map((x) => x * 5);
    expect(mapped).toBeInstanceOf(Ok);
    expect(mapped.unwrap()).toBe(10);
  });
});

describe("Err class", () => {
  it("unwrap throws error", () => {
    const err = new Err<number>(new Error("fail"));
    expect(() => err.unwrap()).toThrow("Called unwrap on an Err value: fail");
  });
  it("unwrapError returns error", () => {
    const error = new Error("fail");
    const err = new Err<number>(error);
    expect(err.unwrapError()).toBe(error);
  });
  it("throwError throws error", () => {
    const error = new Error("fail");
    const err = new Err<number>(error);
    expect(() => err.throwError()).toThrow(error);
  });
  it("map passes error through", () => {
    const error = new Error("fail");
    const err = new Err<number>(error);
    const mapped = err.map((x) => x * 2);
    expect(mapped).toBeInstanceOf(Err);
    expect(mapped.unwrapError()).toBe(error);
  });
});

describe("Result type safety and generics", () => {
  class CustomError extends Error {}
  it("should work with custom error types at instantiation", () => {
    const err = Result.err<string, CustomError>(new CustomError("custom"));
    expect(err.unwrapError()).toBeInstanceOf(CustomError);
  });
  it("should work with custom error types at function return", () => {
    const func = () => {
      return Result.err<number, CustomError>(new CustomError("custom"));
    };
    const result: Result<number, Error> = func();
    expect(result.unwrapError()).toBeInstanceOf(CustomError);
  });
  it("should work with different value types", () => {
    const okStr = Result.ok<string, Error>("hello");
    const okNum = Result.ok<number, Error>(42);
    expect(okStr.unwrap()).toBe("hello");
    expect(okNum.unwrap()).toBe(42);
  });
});
