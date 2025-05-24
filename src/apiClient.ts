import { SearchResult, Doc } from './types';
import { z } from 'zod/v4';

function isNumeric(str: string) {
    if (typeof str != 'string') return false;
    return !isNaN(parseFloat(str));
}

const isbnSchema = z.string().check(
    z.refine((v) => v.trim().length === 10 || v.trim().length === 13, { error: 'Must be 10 or 13-digit' }),
    z.refine((v) => v.trim().split('').every(c => isNumeric(c)), { error: 'Must consist of only numbers' }),
);

const BASE_URL = 'https://openlibrary.org';

/**
 * Searches the Open Library catalog for books.
 * 
 * See [OL API Documentation](https://openlibrary.org/dev/docs/api/search) for param information.
 * @param params - Query params to search by
 */
export async function search(params: Record<string, string>): Promise<SearchResult> {
    const url = `${BASE_URL}/search.json`;
    const searchParams = new URLSearchParams(params);

    const response = await fetch(`${url}?${searchParams.toString()}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const data: SearchResult = await response.json();
    return data;
}

/**
 * Finds a book by its ISBN (10 or 13-digit)
 * @param isbn - The ISBN of the book, e.g. '9780671746063'
 */
export async function findBookByIsbn(isbn: string): Promise<Doc> {
    const result = isbnSchema.safeParse(isbn);

    if (result.error) {
        const msg = result.error.issues.map(i => i.message).join(', ');
        throw new Error(`Failed to parse ISBN: ${msg}`);
    }

    const searchResult = await search({ isbn });

    return searchResult.docs[0];
}
