import { generateSetOfNullifiedFields } from "./generateSetOfNullifiedFields";

describe("generateSetOfNullifiedFields", () => {
  it("nullifies object with a single key", () => {
    const nullified = generateSetOfNullifiedFields({ a: 12 });
    expect(nullified).toEqual([{ name: "a", case: { a: undefined } }]);
  });

  it("nullifies object with a multiple keys and primitive values", () => {
    const nullified = generateSetOfNullifiedFields({
      a: 12,
      b: true,
      c: "hello",
    });

    expect(nullified).toEqual([
      { name: "a", case: { a: undefined, b: true, c: "hello" } },
      { name: "b", case: { a: 12, b: undefined, c: "hello" } },
      { name: "c", case: { a: 12, b: true, c: undefined } },
    ]);
  });

  it("nullifies object with a nested object", () => {
    const nullified = generateSetOfNullifiedFields({
      a: 12,
      b: { test: "hello" },
    });

    expect(nullified).toEqual([
      { name: "a", case: { a: undefined, b: { test: "hello" } } },
      { name: "b.test", case: { a: 12, b: { test: undefined } } },
    ]);
  });

  it("nullifies object with complex nested object", () => {
    const nullified = generateSetOfNullifiedFields({
      a: 12,
      b: { test1: "hello", test2: "world" },
    });

    expect(nullified).toEqual([
      {
        name: "a",
        case: { a: undefined, b: { test1: "hello", test2: "world" } },
      },
      {
        name: "b.test1",
        case: { a: 12, b: { test1: undefined, test2: "world" } },
      },
      {
        name: "b.test2",
        case: { a: 12, b: { test1: "hello", test2: undefined } },
      },
    ]);
  });

  it("handles array nesting special case", () => {
    const nullified = generateSetOfNullifiedFields({
      root: [{ nestedA: true, nestedB: [{ hello: "world" }] }],
    });

    expect(nullified).toEqual([
      {
        name: "root[0].nestedA",
        case: {
          root: {
            "0": { nestedA: undefined, nestedB: [{ hello: "world" }] },
          },
        },
      },
      {
        name: "root[0].nestedB[0].hello",
        case: {
          root: {
            "0": { nestedA: true, nestedB: { "0": { hello: undefined } } },
          },
        },
      },
    ]);
  });
});
