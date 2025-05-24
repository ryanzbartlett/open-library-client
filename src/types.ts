/**
 * Partial interface for a work object from Open Library.
 */
export interface Work {
    title: string;
    description?: string | { value: string };
    subjects?: string[];
    authors?: { author: { key: string } }[];
    // add more fields as needed
}
