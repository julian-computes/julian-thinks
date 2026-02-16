import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export const PAGE_SIZE = 10;

export type BlogPost = CollectionEntry<'blog'>;

export function pubDateFromId(id: string): Date {
	const [year, month, day] = id.split('/');
	return new Date(Number(year), Number(month) - 1, Number(day));
}

export async function getSortedPosts(): Promise<BlogPost[]> {
	const posts = await getCollection('blog');
	return posts.sort(
		(a, b) => pubDateFromId(b.id).valueOf() - pubDateFromId(a.id).valueOf(),
	);
}

export function filterByPrefix(posts: BlogPost[], prefix: string): BlogPost[] {
	return posts.filter((post) => post.id.startsWith(prefix));
}

export interface Page {
	items: BlogPost[];
	page: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export function paginate(posts: BlogPost[], page: number): Page {
	const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
	const start = (page - 1) * PAGE_SIZE;
	const items = posts.slice(start, start + PAGE_SIZE);
	return {
		items,
		page,
		totalPages,
		hasNext: page < totalPages,
		hasPrev: page > 1,
	};
}

export function getUniqueYears(posts: BlogPost[]): string[] {
	const years = new Set(posts.map((post) => post.id.split('/')[0]));
	return [...years].sort().reverse();
}

export function getUniqueMonths(
	posts: BlogPost[],
	year: string,
): string[] {
	const months = new Set(
		posts
			.filter((post) => post.id.startsWith(`${year}/`))
			.map((post) => post.id.split('/')[1]),
	);
	return [...months].sort().reverse();
}

export function prevPageHref(basePath: string, page: number): string | null {
	if (page <= 1) return null;
	if (page === 2) return basePath;
	return `${basePath}page/${page - 1}/`;
}

export function nextPageHref(
	basePath: string,
	page: number,
	totalPages: number,
): string | null {
	if (page >= totalPages) return null;
	return `${basePath}page/${page + 1}/`;
}
