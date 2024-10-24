import {
  useQuery,
  // QueryCache,
  useQueryClient,
  useMutation,
  useIsMutating,
} from "@tanstack/react-query";
import request from "../fetch";
import { toast } from "mui-sonner";
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
    queryFn: () => request<CardData>("tasks", { options: options || { sort: "-created" } }),
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
      onSuccess: () => {
        // Optionally refetch or invalidate queries
        queryClient.invalidateQueries({
          queryKey: ['tasks'],
        });

      },
      onError: (error) => {
        // Handle error
        console.error("Update failed", error);
        toast.error("Error saving changes");
      }
    }
  );
};

export const useCreateTask = (callback?: (data?: any) => void, errorCallback?: (data?: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, FetchOptions>(
    {
      mutationKey: ["tasks"],
      mutationFn: ({ body, options }: FetchOptions) => {
        return request<Record<string, any>>("tasks", { body, options, method: "POST" })
      },
      onSuccess: (returnedData: any) => {
        // Optionally refetch or invalidate queries
        queryClient.invalidateQueries({
          queryKey: ['tasks'],
        });
        // if we have a callback function, pass returned data to it
        if (callback) {
          callback(returnedData);
        }
      },
      onError: (error) => {
        // Handle error
        console.error("Create failed", error);
        toast.error("Error saving changes");
        if (errorCallback) {
          errorCallback(error);
        }
      }
    }
  );
}