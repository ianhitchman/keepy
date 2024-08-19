import {
  useQuery,
  QueryCache,
  useQueryClient,
  useMutation,
  useIsMutating,
} from "@tanstack/react-query";
import request from "../fetch";

import { TagsData } from "../types/Card";
export const useFetchTags = (options?: Record<string, any>) => {
  const isMutating = useIsMutating({ mutationKey: ["tags"] });

  return useQuery({
    queryKey: ["tags"],
    queryFn: () => request<TagsData>("tags", { sort: "-created" }),
    refetchInterval: false,
    staleTime: 300000,
    select: (data) => data?.result, // Ensure that your request function returns data with a `result` property
    enabled: isMutating === 0,
  });
};

// export const useUpdateConfig = ({ account = null, callback }) => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     (data) => {
//       return request({
//         url: `/config`,
//         method: "patch",
//         data: data,
//         params: { account: account },
//       });
//     },
//     {
//       mutationKey: "config",
//       onMutate: async (data) => {
//         await queryClient.cancelQueries(["config", account]);
//         // optimistic update data
//         const currentData = queryClient.getQueryData(["config", account])?.data;
//         await queryClient.setQueryData(["config", account], {
//           data: {
//             ...currentData,
//             ...data,
//           },
//         });
//         queryClient.invalidateQueries(["config", account]);
//       },
//       onSettled: (data) => {
//         queryClient.invalidateQueries(["config", account]);
//       },
//       onSuccess: callback,
//     }
//   );
// };
