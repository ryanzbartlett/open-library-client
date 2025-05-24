import { SearchResult, Doc } from './types';
import { validateIsbn } from './utils';

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
    const validation = validateIsbn(isbn);

    if (!validation.valid) {
        throw new Error(`Failed to parse ISBN: ${validation.errors.join(', ')}`);
    }

    const searchResult = await search({ isbn });

    return searchResult.docs[0];
}
