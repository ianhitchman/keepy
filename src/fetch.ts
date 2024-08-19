import PocketBase from "pocketbase";
const pb = new PocketBase("http://127.0.0.1:8090");

interface RequestResponse<T> {
  result?: T[];
  error?: any;
}

const request = async <T>(collection: string, options: {}): Promise<RequestResponse<T>> => {
  try {
    const result = await pb.collection(collection).getFullList(options) as unknown as T[];
    return { result };
  } catch (error) {
    console.log("ERRAH!", error);
    return { error };
  }
};


export default request