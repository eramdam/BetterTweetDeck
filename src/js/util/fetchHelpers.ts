/** Simple util function to handle status with promises */
export const statusAndJson = (res: Response) => {
  if (res.status >= 200 && res.status < 300) {
    return res.json();
  }

  return Promise.reject(new Error(res.statusText));
};
