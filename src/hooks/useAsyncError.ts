import { useState, useCallback } from "react";

const useAsyncError = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = useState();

  const asyncErrorHandler = useCallback((e: Error) => {
    setError(() => {
      throw e;
    });
  }, [setError]);

  return { asyncErrorHandler };
};

export { useAsyncError };
