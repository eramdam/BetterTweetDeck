export function buildURLWithSearchParams(url: string, searchParams: object) {
  const finalUrl = new URL(url);

  Object.entries(searchParams).forEach(([key, value]) => {
    finalUrl.searchParams.set(key, value);
  });

  return finalUrl.toString();
}
