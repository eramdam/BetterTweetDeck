export async function delayAsync(n: number) {
  return new Promise((resolve) => setTimeout(resolve, n));
}
