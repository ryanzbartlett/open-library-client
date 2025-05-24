import { search, findBookByIsbn } from './apiClient';
import { SearchResult, Doc } from './types';

// Mock fetch globally
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('apiClient', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    const mockDoc: Doc = {
        author_key: ['OL1A'],
        author_name: ['Test Author'],
        cover_edition_key: 'OL1M',
        cover_i: 123456,
        ebook_access: 'public',
        edition_count: 5,
        first_publish_year: 2020,
        has_fulltext: true,
        ia_collection_s: 'test_collection',
        ia: ['test_ia'],
        key: '/works/OL1W',
        language: ['eng'],
        lending_edition_s: 'OL1M',
        lending_identifier_s: 'test_lending',
        public_scan_b: true,
        title: 'Test Book'
    };

    const mockSearchResult: SearchResult = {
        docs: [mockDoc],
        documentation_url: 'https://openlibrary.org/dev/docs/api/search',
        num_found: 1,
        numFound: 1,
        numFoundExact: true,
        offset: null,
        q: 'test query',
        start: 0
    };

    describe('search', () => {
        it('should make fetch request to correct URL with search params', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockSearchResult)
            } as Response);

            const params = { title: 'test book', author: 'test author' };
            const result = await search(params);

            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith(
                'https://openlibrary.org/search.json?title=test+book&author=test+author'
            );
            expect(result).toEqual(mockSearchResult);
        });

        it('should handle single search parameter', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockSearchResult)
            } as Response);

            await search({ q: 'javascript' });

            expect(mockFetch).toHaveBeenCalledWith(
                'https://openlibrary.org/search.json?q=javascript'
            );
        });

        it('should handle empty search parameters', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockSearchResult)
            } as Response);

            await search({});

            expect(mockFetch).toHaveBeenCalledWith(
                'https://openlibrary.org/search.json?'
            );
        });

        it('should handle URL encoding of special characters', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockSearchResult)
            } as Response);

            await search({ title: 'C++ Programming & Design' });

            expect(mockFetch).toHaveBeenCalledWith(
                'https://openlibrary.org/search.json?title=C%2B%2B+Programming+%26+Design'
            );
        });

        it('should throw error when fetch response is not ok', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            } as Response);

            await expect(search({ title: 'test' })).rejects.toThrow(
                'Failed to fetch: 404 Not Found'
            );
        });

        it('should throw error when fetch response is 500', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error'
            } as Response);

            await expect(search({ title: 'test' })).rejects.toThrow(
                'Failed to fetch: 500 Internal Server Error'
            );
        });

        it('should throw error when network request fails', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(search({ title: 'test' })).rejects.toThrow('Network error');
        });

        it('should handle JSON parsing errors', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.reject(new Error('Invalid JSON'))
            } as Response);

            await expect(search({ title: 'test' })).rejects.toThrow('Invalid JSON');
        });
    });

    describe('findBookByIsbn', () => {
        it('should find book with valid 10-digit ISBN', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockSearchResult)
            } as Response);

            const result = await findBookByIsbn('0123456789');

            expect(mockFetch).toHaveBeenCalledWith(
                'https://openlibrary.org/search.json?isbn=0123456789'
            );
            expect(result).toEqual(mockDoc);
        });

        it('should find book with valid 13-digit ISBN', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockSearchResult)
            } as Response);

            const result = await findBookByIsbn('9781234567890');

            expect(mockFetch).toHaveBeenCalledWith(
                'https://openlibrary.org/search.json?isbn=9781234567890'
            );
            expect(result).toEqual(mockDoc);
        });

        it('should throw error for invalid ISBN format', async () => {
            await expect(findBookByIsbn('invalid-isbn')).rejects.toThrow(
                'Failed to parse ISBN: Must be 10 or 13-digit, Must consist of only numbers'
            );
            
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('should throw error for ISBN with wrong length', async () => {
            await expect(findBookByIsbn('123456789')).rejects.toThrow(
                'Failed to parse ISBN: Must be 10 or 13-digit'
            );
            
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('should throw error for ISBN with non-numeric characters', async () => {
            await expect(findBookByIsbn('012345678X')).rejects.toThrow(
                'Failed to parse ISBN: Must consist of only numbers'
            );
            
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('should return first doc from search results', async () => {
            const multipleDocsResult: SearchResult = {
                ...mockSearchResult,
                docs: [mockDoc, { ...mockDoc, title: 'Second Book' }],
                num_found: 2,
                numFound: 2
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(multipleDocsResult)
            } as Response);

            const result = await findBookByIsbn('0123456789');

            expect(result).toEqual(mockDoc);
            expect(result.title).toBe('Test Book');
        });

        it('should handle search API errors', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error'
            } as Response);

            await expect(findBookByIsbn('0123456789')).rejects.toThrow(
                'Failed to fetch: 500 Internal Server Error'
            );
        });

        it('should handle empty search results', async () => {
            const emptyResult: SearchResult = {
                ...mockSearchResult,
                docs: [],
                num_found: 0,
                numFound: 0
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(emptyResult)
            } as Response);

            const result = await findBookByIsbn('0123456789');

            expect(result).toBeUndefined();
        });

        it('should trim whitespace from ISBN before validation', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockSearchResult)
            } as Response);

            await findBookByIsbn('  0123456789  ');

            expect(mockFetch).toHaveBeenCalledWith(
                'https://openlibrary.org/search.json?isbn=++0123456789++'
            );
        });
    });
});