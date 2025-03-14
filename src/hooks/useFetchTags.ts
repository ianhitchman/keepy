import {
  useQuery,
  useIsMutating,
} from "@tanstack/react-query";
import request from "../fetch";

import { TagsData } from "../types/Card";
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
