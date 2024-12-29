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
    metadata: MetadataDto
    demoAppVideoEmbedUrl: string
  }

  export interface MetadataDto {
    id: number; // Unique identifier for the metadata
    title: string; // Title of the blog
    description: string; // Short description or summary of the blog
    keywords: KeywordDto[]; // List of keywords associated with the blog
    image: ImageDto; // Information about the thumbnail or associated image
  }
  
  export interface KeywordDto {
    id: number; // Unique identifier for the keyword
    keyword: string; // The keyword itself
  }
  
  export interface ImageDto {
    id: number; // Unique identifier for the image
    documentId: string; // Document ID for the image
    url: string; // URL of the image
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