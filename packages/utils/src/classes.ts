export function cx(
  ...classes: Array<
    string | Record<string, boolean | null | undefined> | null | undefined
  >
): string {
  // class helper that turns a list of classes into a single string
  // if one of the classes is an object, it will add the key if the value is truthy

  // e.g. cx("foo", "bar") => "foo bar"
  // e.g. cx("foo", { bar: true }) => "foo bar"
  const finalClasses: string[] = [];

  for (const classItem of classes) {
    if (!classItem) {
      continue;
    }

    if (typeof classItem === "string") {
      finalClasses.push(classItem);
      continue;
    }

    for (const className of Object.keys(classItem)) {
      if (classItem[className]) {
        finalClasses.push(className);
      }
    }
  }

  return finalClasses.join(" ");
}

export default cx;
