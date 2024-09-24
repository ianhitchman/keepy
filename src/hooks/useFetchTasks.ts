import {
  useQuery,
  // QueryCache,
  useQueryClient,
  useMutation,
  useIsMutating,
} from "@tanstack/react-query";
import request from "../fetch";
import { CardData } from "../types/Card";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  id?: string;
  body?: any;
  options?: any;
}

export const useFetchTasks = (options?: Record<string, any>) => {
  const isMutating = useIsMutating({ mutationKey: ["tasks"] });

  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => request<CardData>("tasks", { options: { sort: "-created" } }),
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: "always",
    staleTime: 300000,
    select: (data) => {
      const result = data?.result;
      return (Array.isArray(result)) ? result : result ? [result] : null;
    },
    enabled: isMutating === 0,
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, FetchOptions>(
    {
      mutationKey: ["tasks"],
      mutationFn: ({ id, body, options }: FetchOptions) => request<Record<string, any>>("tasks", { id, body, options, method: "PATCH" }),
      onMutate: async (data) => {
        // // Optimistic update
        // const { result: currentData } = queryClient.getQueryData(["tasks"]) as { result: CardData[] };
        // console.log(currentData);
        // const currentCardIndex = currentData?.findIndex((task: CardData) => task.id === data.id);
        // if (currentCardIndex && data.body) {
        //   currentData[currentCardIndex] = {
        //     ...currentData[currentCardIndex],
        //     ...data.body,
        //   };
        // }
        // queryClient.setQueryData(["tasks"], currentData);
      },
      onSuccess: (response) => {
        console.log('response', response);
        // Optionally refetch or invalidate queries
        queryClient.invalidateQueries({
          queryKey: ['tasks'],
        });
      },
      onError: (error) => {
        // Handle error
        console.error("Update order failed", error);
      }
    }
  );
};