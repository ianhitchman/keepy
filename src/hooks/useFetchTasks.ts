import {
  useQuery,
  QueryCache,
  useQueryClient,
  useMutation,
  useIsMutating,
} from "@tanstack/react-query";
import request from "../fetch";

import { CardData } from "../types/Card";
export const useFetchTasks = (options?: Record<string, any>) => {
  const isMutating = useIsMutating({ mutationKey: ["tasks"] });

  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => request<CardData>("tasks", { sort: "-created" }),
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: "always",
    staleTime: 300000,
    select: (data) => data?.result, // Ensure that your request function returns data with a `result` property
    enabled: isMutating === 0,
  });
};
