export function toUrlPath(path: string) {
  // replace all non alphanumerics characters with hyphen
  // then replace all sequential hyphens with single hyphen
  // then remove leading and trailing hyphens
  const lowerCasePath = path.toLowerCase();
  const withHyphens = lowerCasePath.replace(/[^a-z0-9]/g, "-");
  const withSingleHyphens = withHyphens.replace(/-+/g, "-");
  const withoutLeadingHyphens = withSingleHyphens.replace(/^-+/, "");
  const cleanPath = withoutLeadingHyphens.replace(/-+$/, "");

  return cleanPath;
}
