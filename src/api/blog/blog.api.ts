import { getRequest } from "@/utils/api.service";
import { BlogResponse, FetchBlogsParams } from "./blog.interface";

export function fetchBlogs(params?: FetchBlogsParams){
    return new Promise<{ data: BlogResponse }>((resolve) =>
      resolve(getRequest('/blogs',params))
    );
  }