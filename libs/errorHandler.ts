export default async function errorHandler<T extends (...args: any[]) => any>(
  callbackFn: T,
  options?: { log?: boolean; onError?: () => void; onEndStep?: () => void }
): Promise<Awaited<ReturnType<T>> | void> {
  try {
    const result = await callbackFn();
    return result;
  } catch (e) {
    if (options?.log) {
      console.log(e);
    }
    if (options?.onError) {
      options.onError();
    }
  } finally {
    if (options?.onEndStep) {
      options.onEndStep();
    }
  }
}
