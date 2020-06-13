export function buildURLWithSearchParams(url: string, searchParams: object) {
  const finalUrl = new URL(url);

  Object.entries(searchParams).forEach(([key, value]) => {
    finalUrl.searchParams.set(key, value);
  });

  return finalUrl.toString();
}

/** Simple util function to handle status with promises */
export const statusAndJson = (res: Response) => {
  if (res.status >= 200 && res.status < 300) {
    return res.json();
  }

  return Promise.reject(new Error(res.statusText));
};
