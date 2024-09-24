import PocketBase from "pocketbase";
const apiUrl = import.meta.env.VITE_API_URL;
const pb = new PocketBase(`${apiUrl}/`);
import { toast } from "mui-sonner";

interface RequestResponse<T> {
  result?: T | T[];
  error?: any;
}



interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  id?: string;
  body?: any;
  options?: any;
}

const request = async <T>(collection: string, options?: FetchOptions, queryParameters?: {}): Promise<RequestResponse<T>> => {
  try {
    if (!options || typeof options !== "object") {
      options = {};
    }
    let queryString = "";
    if (queryParameters && typeof queryParameters === "object") {
      for (const key in queryParameters) {
        if (queryParameters.hasOwnProperty(key)) {
          const value = (queryParameters as Record<string, string | undefined>)[key];
          if (typeof value === "string") {
            queryString += `${key}=${value}&`;
          }
        }
      }
      queryString = queryString.slice(0, -1);
      if (queryString) {
        queryString = `?${queryString}`;
      }
    }

    let result: T | T[] | undefined;
    let error;

    if (options.method && !options.id) {
      result = await Promise.resolve(undefined);
    }
    else switch (options.method) {
      case "PATCH":
        result = await pb.collection(collection).update(options.id as string, options.body);
        break;
      default:
        result = await pb.collection(collection).getFullList(options.options) as unknown as T[];
    }

    if (error) {
      toast.error(error);
    }
    return { result };
  } catch (error) {
    toast.error("Error fetching data");
    console.error("Fetch error", error);
    return { error };
  }
};

export default request;
