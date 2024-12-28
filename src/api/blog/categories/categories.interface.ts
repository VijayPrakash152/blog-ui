// CategoryImage DTO for the image structure
export interface CategoryImageDto {
    id: number;
    documentId: string;
    url: string;
  }
  
  // Category DTO for each category
  export interface CategoryDto {
    id: number;
    documentId: string;
    name: string;
    description: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    image: CategoryImageDto;
  }
  
  // Pagination DTO for pagination details
  export interface PaginationDto {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  }
  
  // Categories API Response DTO
  export interface CategoriesApiResponseDto {
    data: CategoryDto[];
    meta: {
      pagination: PaginationDto;
    };
  }
  