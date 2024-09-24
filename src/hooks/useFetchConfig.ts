import {
  useQuery,
  // QueryCache,
  useQueryClient,
  useMutation,
  useIsMutating,
} from "@tanstack/react-query";
import request from "../fetch";
import { ConfigData } from "../types/Card";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  id?: string;
  body?: any;
  options?: any;
}

export const useFetchConfig = () => {
  const isMutating = useIsMutating({ mutationKey: ["config"] });

  return useQuery({
    queryKey: ["config"],
    queryFn: () => request<ConfigData>("config", { options: { sort: "created" } }),
    refetchInterval: 60000,
    staleTime: 60000,
    select: (data) => {
      const result = data?.result;
      return (Array.isArray(result)) ? result[0] : null;
    },
    enabled: isMutating === 0,
  });
};


export const useUpdateConfig = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, FetchOptions>(
    {
      mutationKey: ["config"],
      mutationFn: ({ id, body, options }: FetchOptions) => request<Record<string, any>>("config", { id, body, options, method: "PATCH" }),
      onMutate: async (data) => {
        console.log('data', data);
      },
      onSuccess: (response) => {
        console.log('response', response);
        // Optionally refetch or invalidate queries
        queryClient.invalidateQueries({
          queryKey: ['config'],
        });
      },
      onError: (error) => {
        // Handle error
        console.error("Update config failed", error);
      }
    }
  );
};
