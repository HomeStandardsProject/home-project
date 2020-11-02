/*
Converts an object into an array of objects where each item in the array is the object but
with a single parameter becoming undefined. Example:
```
const A = { greeting: "Hello World", name: "Ozzie" }
generateSetOfNullifiedFields(A)
// -> [
    { name: "greeting", case: { { greeting: undefined, name: "Ozzie" } },
    { name: "name", case: { { greeting: "Hello World", name: undefined } },
  ]
```
*/
export function generateSetOfNullifiedFields<T extends Record<string, unknown>>(
  object: T
) {
  const nullifiedFields: { name: string; case: T }[] = [];

  for (const key of Object.keys(object)) {
    const value = object[key];
    if (typeof value === "object") {
      const nullifiedSubproperties = generateSetOfNullifiedFields(value as T);

      const nestedSubproperties = nullifiedSubproperties.map(
        (subPropertyCase) => {
          let caseName: string;
          if (Array.isArray(value)) {
            const keyPaths = subPropertyCase.name.split(".");
            const everythingButTheFirstKey = keyPaths.splice(1).join(".");
            caseName = `${key}[${keyPaths[0]}].${everythingButTheFirstKey}`;
          } else {
            caseName = `${key}.${subPropertyCase.name}`;
          }

          return {
            name: caseName,
            case: { ...object, [key]: subPropertyCase.case },
          };
        }
      );

      nullifiedFields.push(...nestedSubproperties);
    } else {
      const newObject = { ...object, [key]: undefined };
      nullifiedFields.push({ name: key, case: newObject });
    }
  }
  return nullifiedFields;
}
