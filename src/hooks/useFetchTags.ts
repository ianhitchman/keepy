import {
  useQuery,
  useIsMutating,
  useQueryClient,
  useMutation
} from "@tanstack/react-query";
import { toast } from "mui-sonner";
import request from "../fetch";

import { TagsData, FetchOptions } from "../types/Card";
export const useFetchTags = () => {
  const isMutating = useIsMutating({ mutationKey: ["tags"] });

  return useQuery({
    queryKey: ["tags"],
    queryFn: () => request<TagsData>("tags", { options: { sort: "-created" } }),
    refetchInterval: false,
    staleTime: 300000,
    select: (data) => {
      const result = data?.result;
      return (Array.isArray(result)) ? result : result ? [result] : null;
    },
    enabled: isMutating === 0,
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, FetchOptions>(
    {
      mutationKey: ["tags"],
      mutationFn: ({ id, body, options }: FetchOptions) => request<Record<string, any>>("tags", { id, body, options, method: "PATCH" }),
      onSuccess: () => {
        // Optionally refetch or invalidate queries
        queryClient.invalidateQueries({
          queryKey: ['tags'],
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

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, FetchOptions>(
    {
      mutationKey: ["tags"],
      mutationFn: ({ id }: FetchOptions) => request<Record<string, any>>("tags", { id, method: "DELETE" }),
      onSuccess: () => {
        // Optionally refetch or invalidate queries
        queryClient.invalidateQueries({
          queryKey: ['tags'],
        });

      },
      onError: (error) => {
        // Handle error
        console.error("Delete failed", error);
        toast.error("Error deleting item");
      }
    }
  );
};


export const useCreateTag = (callback?: (data?: any) => void, errorCallback?: (data?: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, FetchOptions>(
    {
      mutationKey: ["tags"],
      mutationFn: ({ body, options }: FetchOptions) => {
        return request<Record<string, any>>("tags", { body, options, method: "POST" })
      },
      onSuccess: (returnedData: any) => {
        // Optionally refetch or invalidate queries
        queryClient.invalidateQueries({
          queryKey: ['tags'],
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