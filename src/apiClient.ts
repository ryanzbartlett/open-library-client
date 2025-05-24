import { Work } from './types';

const BASE_URL = 'https://openlibrary.org';

/**
 * Fetches a work by its OLID (Open Library ID).
 * @param olid - The OLID of the work, e.g. 'OL45883W'.
 * @returns A Promise resolving to a Work object.
 */
export async function getWorkByOLID(olid: string): Promise<Work> {
    const url = `${BASE_URL}/works/${olid}.json`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch work ${olid}: ${response.status} ${response.statusText}`);
    }
    const data: Work = await response.json();
    return data;
}
