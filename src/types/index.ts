export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  order?: number;
  image?: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  subcategoryCount?: number;
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  order?: number;
  image?: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  categories: Category[];
}

export interface Blog {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  thumbnail?: {
    url?: string;
  };
  category?: Category;
  metadata?: {
    title?: string;
    description?: string;
    keywords?: Array<{ keyword: string }>;
    image?: { url?: string };
  };
  demoAppVideoEmbedUrl?: string;
  subcategories?: Subcategory[];
}
