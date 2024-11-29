export interface FetchBlogsParams {
    filters?: { [key: string]: string }; // Optionally pass filters for querying blogs
    sort?: string; // Optional sorting parameter
  }

  export interface BlogResponse {
    data: Daum[]
    meta: Meta
  }
  
  export interface Daum {
    id: number
    documentId: string
    title: string
    slug: string
    content: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    thumbnail: Thumbnail
    category: Category
  }

  export interface Category {
    name: string
  }

  export interface Thumbnail {
    url: string;
  }
  
  export interface Meta {
    pagination: Pagination
  }
  
  export interface Pagination {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }  