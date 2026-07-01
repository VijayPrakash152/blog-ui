import type { Blog, Category, Subcategory } from '@/types';

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || 'https://api.vijayprakash.co.in';

const getApiUrl = (path: string) => new URL(path, STRAPI_BASE_URL).toString();

export const resolveStrapiMediaUrl = (url?: string) => {
  if (!url) {
    return null;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const baseUrl = STRAPI_BASE_URL.replace(/\/$/, '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const requestJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(getApiUrl(path), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

interface StrapiListResponse<T> {
  data: T[];
}

export async function getCategories(): Promise<Category[]> {
  const data = await requestJson<StrapiListResponse<Category>>('/api/categories?sort=order:asc&populate=image');
  return data.data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const data = await requestJson<StrapiListResponse<Category>>(
    `/api/categories?filters[slug][$eq]=${slug}&populate=image`
  );
  return data.data?.[0] ?? null;
}

export async function getSubcategories(): Promise<Subcategory[]> {
  const data = await requestJson<StrapiListResponse<Subcategory>>(
    '/api/subcategories?populate=image,categories&sort=order:asc'
  );
  return data.data ?? [];
}

export async function getSubcategoriesByCategory(categorySlug: string): Promise<Subcategory[]> {
  const data = await requestJson<StrapiListResponse<Subcategory>>(
    `/api/subcategories?filters[categories][slug][$eq]=${categorySlug}&populate=image,categories&sort=order:asc`
  );
  return data.data ?? [];
}

export async function getSubcategoryBySlug(slug: string): Promise<Subcategory | null> {
  const data = await requestJson<StrapiListResponse<Subcategory>>(
    `/api/subcategories?filters[slug][$eq]=${slug}&populate=image,categories`
  );
  return data.data?.[0] ?? null;
}

export async function getBlogsByCategory(categorySlug: string): Promise<Blog[]> {
  const data = await requestJson<StrapiListResponse<Blog>>(
    `/api/blogs?filters[category][slug][$eq]=${categorySlug}&populate=thumbnail,subcategories,metadata`
  );
  return data.data ?? [];
}

export async function getBlogsBySubcategory(subcategorySlug: string): Promise<Blog[]> {
  const data = await requestJson<StrapiListResponse<Blog>>(
    `/api/blogs?filters[subcategories][slug][$eq]=${subcategorySlug}&populate=thumbnail,subcategories,metadata`
  );
  return data.data ?? [];
}
