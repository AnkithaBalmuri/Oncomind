import { useQuery } from "@tanstack/react-query";

export function useMockQuery<T>(key: string[], fn: () => Promise<T>) {
  return useQuery({
    queryKey: key,
    queryFn: fn,
    staleTime: 60_000
  });
}
