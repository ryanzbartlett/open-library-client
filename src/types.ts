export interface SearchResult {
    docs: Doc[];
    documentation_url: string;
    num_found: number;
    numFound: number;
    numFoundExact: boolean;
    offset: null;
    q: string;
    start: number;
}

export interface Doc {
    author_key: string[];
    author_name: string[];
    cover_edition_key: string;
    cover_i: number;
    ebook_access: string;
    edition_count: number;
    first_publish_year: number;
    has_fulltext: boolean;
    ia_collection_s: string;
    ia: string[];
    key: string;
    language: string[];
    lending_edition_s: string;
    lending_identifier_s: string;
    public_scan_b: boolean;
    title: string;
}