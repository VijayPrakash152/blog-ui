import type { Blog, Category, Cheatsheet, Subcategory } from '@/types';

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || 'https://api.vijayprakash.co.in';

const getApiUrl = (path: string) => new URL(path, STRAPI_BASE_URL).toString();

const buildQueryString = (params: Array<[string, string | boolean | undefined]>) => {
  const searchParams = new URLSearchParams();

  params.forEach(([key, value]) => {
    if (value === undefined || value === '') {
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

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

const requestJson = async <T>(path: string, fallbackValue: T): Promise<T> => {
  try {
    const response = await fetch(getApiUrl(path), {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.warn(`Strapi request failed for ${path}: ${response.status}`);
      return fallbackValue;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(`Strapi request error for ${path}:`, error);
    return fallbackValue;
  }
};

interface StrapiListResponse<T> {
  data: T[];
}

export async function getCategories(): Promise<Category[]> {
  const data = await requestJson<StrapiListResponse<Category>>(
    `/api/categories${buildQueryString([
      ['sort', 'order:asc'],
      ['populate[image]', 'true'],
    ])}`,
    { data: [] }
  );
  return data.data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const data = await requestJson<StrapiListResponse<Category>>(
    `/api/categories${buildQueryString([
      ['filters[slug][$eq]', slug],
      ['populate[image]', 'true'],
    ])}`,
    { data: [] }
  );
  return data.data?.[0] ?? null;
}

export async function getSubcategories(): Promise<Subcategory[]> {
  const data = await requestJson<StrapiListResponse<Subcategory>>(
    `/api/subcategories${buildQueryString([
      ['sort', 'order:asc'],
      ['populate[image]', 'true'],
      ['populate[categories]', 'true'],
    ])}`,
    { data: [] }
  );
  return data.data ?? [];
}

export async function getSubcategoriesByCategory(categorySlug: string): Promise<Subcategory[]> {
  const data = await requestJson<StrapiListResponse<Subcategory>>(
    `/api/subcategories${buildQueryString([
      ['filters[categories][slug][$eq]', categorySlug],
      ['sort', 'order:asc'],
      ['populate[image]', 'true'],
      ['populate[categories]', 'true'],
    ])}`,
    { data: [] }
  );
  return data.data ?? [];
}

export async function getSubcategoryBySlug(slug: string): Promise<Subcategory | null> {
  const data = await requestJson<StrapiListResponse<Subcategory>>(
    `/api/subcategories${buildQueryString([
      ['filters[slug][$eq]', slug],
      ['populate[image]', 'true'],
      ['populate[categories]', 'true'],
    ])}`,
    { data: [] }
  );
  return data.data?.[0] ?? null;
}

export async function getBlogsByCategory(categorySlug: string): Promise<Blog[]> {
  const data = await requestJson<StrapiListResponse<Blog>>(
    `/api/blogs${buildQueryString([
      ['filters[category][slug][$eq]', categorySlug],
      ['populate[thumbnail]', 'true'],
      ['populate[subcategories]', 'true'],
      ['populate[metadata]', 'true'],
    ])}`,
    { data: [] }
  );
  return data.data ?? [];
}

export async function getBlogsBySubcategory(subcategorySlug: string): Promise<Blog[]> {
  const data = await requestJson<StrapiListResponse<Blog>>(
    `/api/blogs${buildQueryString([
      ['filters[subcategories][slug][$eq]', subcategorySlug],
      ['populate[thumbnail]', 'true'],
      ['populate[subcategories]', 'true'],
      ['populate[metadata]', 'true'],
    ])}`,
    { data: [] }
  );
  return data.data ?? [];
}

export async function getCheatsheets(): Promise<Cheatsheet[]> {
  const data = await requestJson<StrapiListResponse<Cheatsheet>>(
    `/api/cheatsheets${buildQueryString([
      ['populate', 'subcategories'],
      ['sort', 'order:asc'],
    ])}`,
    { data: [] }
  );
  return data.data ?? [];
}

export async function getCheatsheetBySlug(slug: string): Promise<Cheatsheet | null> {
  const data = await requestJson<StrapiListResponse<Cheatsheet>>(
    `/api/cheatsheets${buildQueryString([
      ['filters[slug][$eq]', slug],
      ['populate', 'subcategories'],
    ])}`,
    { data: [] }
  );
  return data.data?.[0] ?? null;
}

export async function getCheatsheetsBySubcategory(subcategorySlug: string): Promise<Cheatsheet[]> {
  const data = await requestJson<StrapiListResponse<Cheatsheet>>(
    `/api/cheatsheets${buildQueryString([
      ['filters[subcategories][slug][$eq]', subcategorySlug],
      ['populate', 'subcategories'],
      ['sort', 'order:asc'],
    ])}`,
    { data: [] }
  );
  return data.data ?? [];
}
