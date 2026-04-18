import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

import { fetchAPI } from "./apiFetcher";

export function useMe(shouldFetch = true) {
  const { data, error, isLoading } = useSWR(shouldFetch ? "/api/me/me" : null);
  return { data, error, isLoading };
}

export function useProduct(objectID: string) {
  const { data, error, isLoading } = useSWRImmutable(
    `/api/products/${objectID}`,
    (endpoint) => fetchAPI(endpoint, false),
  );
  return { data, error, isLoading };
}
