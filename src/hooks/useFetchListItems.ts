import {
  useQuery,
  useQueryClient,
  useMutation,
  useIsMutating,
} from "@tanstack/react-query";
import request from "../fetch";
import { toast } from "mui-sonner";

import { ListItem, FetchOptions } from "../types/Card";

export const useFetchListItems = () => {
  const isMutating = useIsMutating({ mutationKey: ["listItems"] });

  return useQuery({
    queryKey: ["listItems"],
    queryFn: () => request<ListItem>("listItems", { options: { sort: "position" } }),
    refetchInterval: false,
    staleTime: 300000,
    select: (data) => {
      const result = data?.result;
      return (Array.isArray(result)) ? result : result ? [result] : null;
    },
    enabled: isMutating === 0,
  });
};

export const useUpdateListItem = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, FetchOptions>(
    {
      mutationKey: ["listItems"],
      mutationFn: ({ id, body, options }: FetchOptions) => request<Record<string, any>>("listItems", { id, body, options, method: "PATCH" }),
      onSuccess: () => {
        // Optionally refetch or invalidate queries
        queryClient.invalidateQueries({
          queryKey: ['listItems'],
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

export const useCreateListItem = (callback?: (data?: any) => void, errorCallback?: (data?: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, FetchOptions>(
    {
      mutationKey: ["listItems"],
      mutationFn: ({ body, options }: FetchOptions) => {
        return request<Record<string, any>>("listItems", { body, options, method: "POST" })
      },
      onSuccess: (returnedData: any) => {
        queryClient.invalidateQueries({
          queryKey: ['listItems'],
        });
        queryClient.refetchQueries({
          queryKey: ['listItems'],
        });
        if (callback) {
          callback(returnedData);
        }
      },
      onError: (error) => {
        // Handle error
        console.error("Create failed", error);
        toast.error("Error adding list item");
        if (errorCallback) {
          errorCallback(error);
        }
      }
    }
  );
}

export const useDeleteListItem = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, FetchOptions>(
    {
      mutationKey: ["listItems"],
      mutationFn: ({ id }: FetchOptions) => request<Record<string, any>>("listItems", { id, method: "DELETE" }),
      onSuccess: () => {
        // Optionally refetch or invalidate queries
        queryClient.invalidateQueries({
          queryKey: ['listItems'],
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